'use strict';

var _ = require('lodash');
var Plugin = require('./plugin.model');

// Get list of plugins
exports.index = function(req, res) {
  Plugin.find(function (err, plugins) {
    if(err) { return handleError(res, err); }
    return res.json(200, plugins);
  });
};

// Get a single plugin
exports.show = function(req, res) {
  Plugin.findById(req.params.id, function (err, plugin) {
    if(err) { return handleError(res, err); }
    if(!plugin) { return res.send(404); }
    return res.json(plugin);
  });
};

// Creates a new plugin in the DB.
exports.create = function(req, res) {
  Plugin.create(req.body, function(err, plugin) {
    if(err) { return handleError(res, err); }
    return res.json(201, plugin);
  });
};

// Updates an existing plugin in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Plugin.findById(req.params.id, function (err, plugin) {
    if (err) { return handleError(res, err); }
    if(!plugin) { return res.send(404); }
    var updated = _.merge(plugin, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, plugin);
    });
  });
};

// Deletes a plugin from the DB.
exports.destroy = function(req, res) {
  Plugin.findById(req.params.id, function (err, plugin) {
    if(err) { return handleError(res, err); }
    if(!plugin) { return res.send(404); }
    plugin.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}