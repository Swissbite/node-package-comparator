/**
 * This file is part of Node Package Comparator.
 *
 * Node Package Comparator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Node Package Comparator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with Node Package Comparator.  If not, see <http://www.gnu.org/licenses/>.
 */
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
  var queryParam = req.query;
  var count = false;
  var qry = Scheduler.find({type: 'package'}, 'keyword amount');
  if (queryParam.count) {
    qry.count();
    count = true;
  }
  else {
    if (queryParam.sort) {
      qry.sort(req.query.sort);
    }
    else {
      qry.sort('keyword');
    }
    if (queryParam.limit) {
      qry.limit(queryParam.limit);
    }
    if (queryParam.skip) {
      qry.skip(queryParam.skip);
    }
  }
  qry.exec(function(err, schedulers) {
    if (err) {
      return handleError(res, err);
    }
    if (count) {
      res.json(200, {count: schedulers});
    }
    else {
      res.json(200, schedulers);
    }
  });
  Scheduler.updateKeywords();
};

function handleError(res, err) {
  return res.send(500, err);
}
