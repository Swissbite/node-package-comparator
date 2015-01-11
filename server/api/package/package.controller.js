'use strict';

var _ = require('lodash');
var Scheduler = require('../scheduler/scheduler.model');
var Package = require('./package.model.js');

// Get list of plugins
exports.index = function (req, res) {
  Package.find(function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, plugins);
  });
};

// Get a single package
exports.show = function (req, res) {
  Package.findById(req.params.id, function (err, plugin) {
    if (err) {
      return handleError(res, err);
    }
    if (!plugin) {
      return res.send(404);
    }
    return res.json(plugin);
  });
};

exports.byName = function (req, res) {
  var name = req.params.name;
  Package.findOne({name: name}, function (err, doc) {
    if (err) {
      return handleError(res, err);
    }
    if (!doc) {
      return res.send(404);
    }
    return res.json(doc);
  })
};

exports.byKeyword = function (req, res) {
  var keyword = req.params.keyword;
  Scheduler.findOne({keyword: keyword, type: 'package'}, function(err, scheduler) {
    if (!err && scheduler) {
      scheduler.run();
    }
  });
  Package.find({keywords: {$elemMatch: {$regex: new RegExp('^' + keyword + '$', 'i')}}}, function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    if (!plugins || plugins.length === 0) {
      return res.send(404);
    }
    return res.json(plugins);
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
