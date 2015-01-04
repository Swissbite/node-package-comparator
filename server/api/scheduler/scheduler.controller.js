'use strict';

var _ = require('lodash');
var Scheduler = require('./scheduler.model');

// Get list of schedulers
exports.index = function (req, res) {
  Scheduler.find(function (err, schedulers) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, schedulers);
  });
};

// Get a single scheduler
exports.show = function (req, res) {
  Scheduler.findById(req.params.id, function (err, scheduler) {
    if (err) {
      return handleError(res, err);
    }
    if (!scheduler) {
      return res.send(404);
    }
    return res.json(scheduler);
  });
};

// Creates a new scheduler in the DB.
exports.create = function (req, res) {
  Scheduler.create(req.body, function (err, scheduler) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, scheduler);
  });
};

// Updates an existing scheduler in the DB.
exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Scheduler.findById(req.params.id, function (err, scheduler) {
    if (err) {
      return handleError(res, err);
    }
    if (!scheduler) {
      return res.send(404);
    }
    var updated = _.merge(scheduler, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, scheduler);
    });
  });
};

// Deletes a scheduler from the DB.
exports.destroy = function (req, res) {
  Scheduler.findById(req.params.id, function (err, scheduler) {
    if (err) {
      return handleError(res, err);
    }
    if (!scheduler) {
      return res.send(404);
    }
    scheduler.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

exports.keywords = function (req, res) {
  Scheduler.find({type: 'keywords'}, function(err, schedulers) {

  })
}

function handleError(res, err) {
  return res.send(500, err);
}
