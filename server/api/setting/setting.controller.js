'use strict';

var _ = require('lodash');
var Setting = require('./setting.model');

// Get list of settings
exports.index = function(req, res) {
  Setting.find(function (err, settings) {
    if(err) { return handleError(res, err); }
    return res.json(200, settings);
  });
};

// Get a single setting
exports.show = function(req, res) {
  Setting.findById(req.params.id, function (err, setting) {
    if(err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    return res.json(setting);
  });
};

// Creates a new setting in the DB.
exports.create = function(req, res) {
  Setting.create(req.body, function(err, setting) {
    if(err) { return handleError(res, err); }
    return res.json(201, setting);
  });
};

// Updates an existing setting in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Setting.findById(req.params.id, function (err, setting) {
    if (err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    var updated = _.merge(setting, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, setting);
    });
  });
};

// Deletes a setting from the DB.
exports.destroy = function(req, res) {
  Setting.findById(req.params.id, function (err, setting) {
    if(err) { return handleError(res, err); }
    if(!setting) { return res.send(404); }
    setting.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}