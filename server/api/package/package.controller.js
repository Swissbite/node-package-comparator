'use strict';

var _ = require('lodash');
var Scheduler = require('../scheduler/scheduler.model');
var Plugin = require('./package.model.js');

// Get list of plugins
exports.index = function (req, res) {
  Plugin.find(function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, plugins);
  });
};

// Get a single package
exports.show = function (req, res) {
  Plugin.findById(req.params.id, function (err, plugin) {
    if (err) {
      return handleError(res, err);
    }
    if (!plugin) {
      return res.send(404);
    }
    return res.json(plugin);
  });
};

exports.byKeyword = function (req, res) {
  Scheduler.findOne({})
  Plugin.find({keyword: {$match: [req.params.keyword]}}, function (err, plugins) {
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
  return res.send(500, err);
}
