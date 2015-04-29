'use strict';

var _ = require('lodash');
var async = require('async');
var Scheduler = require('../scheduler/scheduler.model');
var NodePackage = require('./nodepackage.model.js');
var mapReduceModelCreator = require('../../components/MapReduceSchema');
var Setting = require('../setting/setting.model');

// Get list of plugins
exports.index = function (req, res) {
  var query = req.query;
  var limit = query.limit ? query.limit : 5000;
  var sort = query.sort ? query.sort : 'githubStars DESC';
  NodePackage.find().sort(sort).limit(limit).exec(function (err, nodePackages) {
    if (err) {
      return handleError(res, err);
    }
    res.status(200);
    return res.json(nodePackages);
  });
};

exports.newIndex = function (req, res) {
  var query = req.body;
  var keyword = query.keyword;
  var limit = query.limit ? query.limit : 5000;
  var sorts = query.sorts && query.sorts.length > 0 ? query.sorts : [{"field": "githubStars", "ascending": false}];
  var skip = query.skip ? query.skip : 0;
  var filters = query.filters ? query.filters : undefined;
  var queryParam = {};
  if (keyword) {
    queryParam.keywords = keyword.toLocaleLowerCase();
  }
  _.forIn(filters, function (value, key) {
    if (value) {
      queryParam[key] = {$regex: new RegExp(value, 'i')};
    }
  });
  console.log(queryParam);

  async.parallel({
    count: function count(cb) {

      NodePackage.count(queryParam, cb);
    }, results: function result(cb) {
      var query = NodePackage.find(queryParam);
      var sortString = ' ';

      console.log(sorts, sortString);
      _.forEach(sorts, function (sort) {
        var elem = sort.ascending ? '' : '-';
        console.log('elem1:', elem, sortString);
        elem += sort.field;

        console.log('elem2:', elem, sortString);
        sortString += elem + ' ';

        console.log('elem3:', elem, sortString);
      });
      console.log(sorts, sortString);
      query.sort(sortString.trim()).skip(skip).limit(limit);
      query.exec(cb);
    }
  }, function (err, data) {
    if (err) {
      return handleError(res, err);
    }
    res.json(data);
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
  var queryParam = req.query;
  var keyword = req.params.keyword;
  var qry = NodePackage.find({keywords: keyword.toLowerCase()});
  var count = false;
  if (queryParam.count) {
    count = true;
    qry.count();
  }
  else {

    if (queryParam.sort) {
      qry.sort(queryParam.sort);
    }
    else {
      qry.sort('-githubStars');
    }
    if (queryParam.skip) {
      qry.skip(queryParam.skip);
    }
    if (queryParam.limit) {
      qry.limit(queryParam.limit);
    }
  }
  qry.exec(function (err, plugins) {
    if (err) {
      return handleError(res, err);
    }
    if (!plugins) {
      return res.send(404);
    }
    if (count) {
      return res.json({count: plugins});
    }
    return res.json(plugins);
  });
  Scheduler.updateKeywords();
  Scheduler.updatePackages(keyword.toLowerCase());
};

exports.statistics = function (req, res) {
  var mapReduceCollectionName = 'package_keyword_statistics';
  var mapReduceObj = {
    map: function () {
      var i = 0, length = this.keywords.length, keywords = this.keywords;
      for (i; i < length; i++) {
        emit(keywords[i].toLowerCase(), 1);
      }
    },
    reduce: function (k, values) {
      return Array.sum(values);
    },
    out: {replace: mapReduceCollectionName}
  };

  function sendStatistics() {
    var model = mapReduceModelCreator(mapReduceCollectionName);
    async.parallel({
        countOfKeywords: function (cb) {
          model.count(cb);
        },
        top25: function (cb) {
          model.find().sort({value: -1, _id: 1}).limit(25).exec(cb);
        },
        low25: function (cb) {
          model.find().sort({value: 1, _id: 1}).limit(25).exec(cb);
        }, countOfKeywordsLower10: function (cb) {
          model.count({value: {$lt: 10}}, cb);
        }, countOfKeywordsBetween10And100: function (cb) {
          model.count({value: {$gte: 10, $lt: 100}}, cb);
        }, countOfKeywordsBetween100And500: function (cb) {
          model.count({value: {$gte: 100, $lt: 500}}, cb);
        }, countOfKeywordsBetween500And1000: function (cb) {
          model.count({value: {$gte: 500, $lt: 1000}}, cb);
        }, countOfKeywordsGreater1000: function (cb) {
          model.count({value: {$gte: 1000}}, cb);
        }, distribution: function (cb) {
          model.aggregate().group({_id: '$value', total: {$sum: 1}, keys: {$push: '$_id'}}).sort({_id: 1}).exec(cb);
        }
      }, function (err, resObj) {
        if (err) {
          return handleError(res, err);
        }
        res.json(resObj);
      }
    );
  }

  function updateStats(callback) {
    NodePackage.mapReduce(mapReduceObj, function (err, model, stats) {
      if (err) {
        return callback(err);
      }
      console.log(stats);
      callback();

    });
  }

  Setting.findOne({name: mapReduceCollectionName}, function (err, doc) {
    function updateStatsCallback(err) {
      if (err) {
        return handleError(res, err);
      }
      sendStatistics();
    }

    if (err) {
      return handleError(res, err);
    }
    if (!doc) {
      Setting.create({
        name: mapReduceCollectionName,
        info: 'last statistic mapReduce update called',
        value: new Date(),
        editable: false
      }, function (err) {
        if (err) {
          return handleError(res, err);
        }
        updateStats(updateStatsCallback);
      })
    }
    else {
      Scheduler.count({type: 'package', lastFinish: {$gte: doc.value}}).exec(function (err, count) {
        if (err) {
          return handleError(res, err);
        }
        if (count <= 0) {
          sendStatistics();
        }
        else {
          doc.value = new Date();
          doc.save(function () {
            updateStats(updateStatsCallback);
          });
        }
      });
    }
  })

};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
