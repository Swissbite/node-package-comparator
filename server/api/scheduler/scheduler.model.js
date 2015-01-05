'use strict';

var mongoose = require('mongoose'),
  moment = require('moment'),
  _ = require('lodash'),
  async = require('async'),
  Schema = mongoose.Schema,
  environment = require('../../config/environment'),
  Package = require('../package/package.model');

var SchedulerSchema = new Schema({
  type: {type: String, enum: ['keywords', 'packages'], required: true, index: true},
  name: {type: String, index: {unique: true, sparse: true}},
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
      data = JSON.parse(data);
      callback(null, data)
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

function checkIfAllowedToRun(instance) {
  return true;
  //return !instance.active && (!instance.lastRun || moment().subtract(1, 'day').isBefore(instance.lastRun));
}

function setActiveAndLastRun(instance, callback) {
  instance.active = true;
  instance.lastRun = Date.now();
  instance.save(callback);
}

function setDoneAndLastFinsh(instance, callback) {
  instance.active = false;
  instance.lastFinish = Date.now();
  instance.save(callback);
}

function refreshKeywordsScheduler(instance) {
  var toRefresh = checkIfAllowedToRun(instance);
  console.log('Refresh?', toRefresh);
  if (toRefresh) {
    setActiveAndLastRun(instance, function refreshKeywords(err, scheduler) {
      var registry = environment.registry,
        clientLib = getRequestClientLib(registry.uri),
        byKeywordViewUrl = registry.uri + registry.designDocumentPath + registry.byKeywordView + '?group_level=1';
      if (err) {
        console.log(err);
        return void 0;
      }
      clientLib.get(byKeywordViewUrl, function (res) {
        responseHandler(res, function updateAllPackageSchedulers(err, data) {
          var keywords = [];
          _.forEach(data.rows, function selectKeyword(elem) {
            if (elem.key.length > 0) {
              keywords.push(elem.key[0]);
            }
          });
          console.log('before async');
          async.parallel({
            deleteObsoleteKeywords: function (cb) {
              Scheduler.remove({name: {$nin: keywords}, type: 'packages'}, cb);
            },
            createNewKeywords: function (cb) {
              Scheduler.find({type: 'packages'}, 'name', function (err, keywordSchedulers) {
                var schedulerKeywords = [], toCreateKeywords;

                function splitCreate(schedulerKeywordDocs, cb) {
                  var i = 0, maxEach = 10000, total = schedulerKeywords.length, splicedSchedulerDocs = [], functionList = [];
                  for (i; i < total; i += maxEach) {
                    splicedSchedulerDocs[i / maxEach] = schedulerKeywordDocs.slice(i, i + maxEach);
                  }
                  _.forEach(splicedSchedulerDocs, function (splicedDocs, idx) {
                    functionList.push(function createDocs(cb) {
                      Scheduler.create(splicedDocs, cb);
                    });
                  });
                  async.parallel(functionList, cb);
                }

                _.forEach(keywordSchedulers, function (extractKeywords) {
                  schedulerKeywords.push(extractKeywords.name);
                });
                toCreateKeywords = _.difference(keywords, schedulerKeywords);
                schedulerKeywords = [];
                _.forEach(toCreateKeywords, function createDoc(keyword) {
                  schedulerKeywords.push({type: 'packages', name: keyword});
                });
                if (schedulerKeywords.length > 1000) {
                  splitCreate(schedulerKeywords, cb);
                } else {
                  Scheduler.create(schedulerKeywords, cb);
                }


              });
            }
          }, function (err, obj) {
            setDoneAndLastFinsh(scheduler, function() {});
          });

        });
      });


    });


  }
  return toRefresh;
}

function refreshPackageScheduler(instance) {

};

SchedulerSchema.methods.run = function run() {
  var me = this;
  if (me.type === 'keywords') {
    return refreshKeywordsScheduler(me);
  } else if (me.type === 'packages') {
    return refreshPackageScheduler(me);
  }
  return false;
};

module.exports = Scheduler = mongoose.model('Scheduler', SchedulerSchema);
