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

var mongoose = require('mongoose'),
  moment = require('moment'),
  _ = require('lodash'),
  async = require('async'),
  Schema = mongoose.Schema,
  environment = require('../../config/environment'),
  Package = require('../package/package.model');

  var SchedulerSchema = new Schema({
  type: {type: String, enum: ['keywords', 'package'], required: true, index: true},
  keyword: {type: String, index: {unique: true, sparse: true}},
  active: Boolean,
  lastRun: Date,
  lastFinish: Date
});

//Defined at the end of the file while module.export

var Scheduler;

/**
 * Generic response handler.
 * @param response The http(s) response.
 * @param callback The callback to be called with err and data.
 */
function responseHandler(response, callback) {
  var data = '';
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    data += chunk;
  });
  response.on('end', function () {
    try {

      console.log(data);
      data = JSON.parse(data);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}
/**
 * Helper to define if the url is either https or http.
 * @param baseUrl Base url. Has to start with http:// or https://
 * @returns exports request client lib, that means either https or http.
 */
function getRequestClientLib(baseUrl) {
  var match = baseUrl.match(/^https:\/\//i);
  if (match && match.length === 1) {
    return require('https');
  }
  return require('http');
}

/**
 * Check if the last run is older than one day or not yet finished.
 * @param {Scheduler} instance of Scheduler
 * @returns {boolean} true if not active and lastRun is older than one day.
 */
function checkIfAllowedToRun(instance) {
  return !instance.active && (!instance.lastRun || moment().subtract(1, 'day').isAfter(instance.lastRun));
}

/**
 * Updates the instance to active=true and sets the lastRun to Date.now().
 * Stores the instance directly to the db. Calls the callback with the results of the save function.
 * @param {Scheduler} instance of Scheduler
 * @param {function} callback
 */
function setActiveAndLastRun(instance, callback) {
  instance.active = true;
  instance.lastRun = Date.now();
  instance.save(callback);
}

/**
 * Updates the instance to active=true and sets the lastFinish to Date.now().
 * Stores the instance directly to the db. Calls the callback with the results of the save function.
 * @param {Scheduler} instance of Scheduler
 * @param {function} callback
 */
function setDoneAndLastFinsh(instance, callback) {
  instance.active = false;
  instance.lastFinish = Date.now();
  instance.save(callback);
}

/**
 *
 * @param {String} url the url without query parameters. As example: https://registry.npmjs.org/-/_view/byKeyword
 * @param {Object} queryParams The query params. Each value will be stringified by @{JSON#stringify}
 * @param {function} callback
 */
function getRegistryData(url, queryParams, callback) {
  var clientLib = getRequestClientLib(url);
  var queryParamsAsString = '';

  _.forIn(queryParams, function stringifyForCouch(item, key) {
    queryParamsAsString += queryParamsAsString.length === 0 ? '?' : '&';
    queryParamsAsString += key + '=' + JSON.stringify(item);
  });

  clientLib.get(url + queryParamsAsString, function (res) {
    responseHandler(res, callback);
  });
}

function refreshKeywordsScheduler(instance) {
  var toRefresh = checkIfAllowedToRun(instance);
  if (toRefresh) {
    setActiveAndLastRun(instance, function refreshKeywords(err, scheduler) {
      var registry = environment.registry;

      if (err) {
        console.log(err);
        return void 0;
      }

      getRegistryData(registry.uri + registry.designDocumentPath + registry.byKeywordView, {
        group_level: 1
      }, function updateAllPackageSchedulers(err, data) {
        var keywords = [];
        _.forEach(data.rows, function selectKeyword(elem) {
          if (elem.key.length > 0) {
            keywords.push(elem.key[0]);
          }
        });

        async.parallel([
          function (cb) {
            Scheduler.remove({keyword: {$nin: keywords}, type: 'package'}, cb);
          },
          function (cb) {
            Scheduler.find({type: 'package'}, 'keyword', function (err, keywordSchedulers) {
              var schedulerKeywords = [], toCreateKeywords;

              function splitCreate(schedulerKeywordDocs, cb) {
                var i = 0, maxEach = 10000, total = schedulerKeywords.length, splicedSchedulerDocs = [], functionList = [];
                for (i; i < total; i += maxEach) {
                  splicedSchedulerDocs[i / maxEach] = schedulerKeywordDocs.slice(i, i + maxEach);
                }
                _.forEach(splicedSchedulerDocs, function (splicedDocs) {
                  functionList.push(function createDocs(cb) {
                    Scheduler.create(splicedDocs, cb);
                  });
                });
                async.parallel(functionList, cb);
              }

              _.forEach(keywordSchedulers, function (extractKeywords) {
                schedulerKeywords.push(extractKeywords.keyword);
              });

              toCreateKeywords = _.difference(keywords, schedulerKeywords);
              schedulerKeywords = [];
              _.forEach(toCreateKeywords, function createDoc(keyword) {
                schedulerKeywords.push({type: 'package', keyword: keyword});
              });

              if (schedulerKeywords.length > 1000) {
                splitCreate(schedulerKeywords, cb);
              } else {
                Scheduler.create(schedulerKeywords, cb);
              }
            });
          }
        ], function finish() {
          setDoneAndLastFinsh(scheduler, function () {
          });
        });

      });
    });
  }
  return toRefresh;
}

function refreshPackageScheduler(instance) {
  console.log('called ' + instance.keyword);
  /*var toRefresh = checkIfAllowedToRun(instance);
   if (toRefresh) {
   setActiveAndLastRun(instance, function updatePackages(err, scheduler) {*/
  var scheduler = instance;
  var registry = environment.registry;
  getRegistryData(registry.uri +
  registry.designDocumentPath +
  registry.byKeywordView, {
    group_level: 2,
    startkey: [scheduler.keyword],
    endkey: [scheduler.keyword, {}, {}]
  }, function (err, data) {
    var asyncUpdateCalls = [];

    function createCall(name) {
      return function (cb) {
        getRegistryData(registry.uri + name, {}, function (err, npmInfo) {

          var packageData;
          if (err) {
            console.log(err);
            cb(err);
            return void 0;
          }
          packageData = {
            name: npmInfo.name,
            description: npmInfo.description,
            version: npmInfo["dist-tags"].latest,
            lastModified: npmInfo.time.modified,
            author: npmInfo.author.name,
            npmStars: npmInfo.users ? npmInfo.users.length : 0,
            keywords: npmInfo.keywords
          };

          if (!npmInfo.homepage || !npmInfo.repository) {
            console.log(name, npmInfo.homepage, npmInfo.repository);
          }
          cb(null, packageData);
        });
      };
    }

    _.forEach(data.rows, function (obj) {
      asyncUpdateCalls.push(createCall(obj.key[1]));
    });
    console.log('count async calls:', asyncUpdateCalls.length);
    async.parallel(asyncUpdateCalls);
  });
  /*});
   }
   return toRefresh;*/
}

SchedulerSchema.methods.run = function run() {
  var me = this;
  if (me.type === 'keywords') {
    return refreshKeywordsScheduler(me);
  } else if (me.type === 'package') {
    return refreshPackageScheduler(me);
  }
  return false;
};

module.exports = Scheduler = mongoose.model('Scheduler', SchedulerSchema);
