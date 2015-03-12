'use strict';

var _ = require('lodash');
var Scheduler = require('../scheduler/scheduler.model');
var NodePackage = require('./nodepackage.model.js');

// Get list of plugins
exports.index = function (req, res) {
  NodePackage.find(function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    return res.json(plugins);
  });
};

// Get a single nodePackage
exports.show = function (req, res) {
  NodePackage.findById(req.params.id, function (err, elem) {
    if (err) {
      return handleError(res, err);
    }
    if (!elem) {
      return res.send(404);
    }
    return res.json(elem);
  });
};

exports.byName = function (req, res) {
  var name = req.params.name;
  NodePackage.findOne({name: name}, function (err, doc) {
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
  NodePackage.find({keywords: keyword.toLowerCase()}, function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    if (!plugins || plugins.length === 0) {
      return res.send(404);
    }
    return res.json(plugins);
  });
  Scheduler.updateKeywords();
  Scheduler.updatePackages(keyword.toLowerCase());
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
