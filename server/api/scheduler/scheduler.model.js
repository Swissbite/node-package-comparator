'use strict';

var mongoose = require('mongoose'),
  moment = require('moment'),
  Schema = mongoose.Schema,
  environment = require('../../config/environment'),
  Package = require('../package/package.model');
var http = require('http');

function checkIfAllowedToRun(instance) {
  return !instance.active && (!instance.lastRun || moment().subtract(1, 'day').isBefore(instance.lastRun));
}

function setActiveAndLastRun(instance, callback) {
  instance.active = true;
  instance.lastRun = Date.now();
  instance.save(callback);
}

function refreshKeywordScheduler(instance) {
  var toRefresh = checkIfAllowedToRun(instance);
  if (toRefresh) {
    setActiveAndLastRun(instance, function refreshKeywords (err, scheduler) {
      var registry = environment.registry,
        byKeywordViewUrl = registry.uri + registry.designDocumentPath + registry.byKeywordView;
      if (err) {
        console.log(err);
        return void 0;
      }
    });


  }
  return toRefresh;
}

function refreshPackagesScheduler(instance) {

};

var SchedulerSchema = new Schema({
  type: {type: String, enum: ['keywords', 'packages'], required: true},
  name: {type: String, index: {unique:true,  sparse: true}},
  active: Boolean,
  lastRun: Date
});
SchedulerSchema.methods.run = function run () {
  var me = this;
  if (me.type === 'keywords') {
    return refreshKeywordScheduler(me);
  } else if (me.type === 'packages') {
    return true;
  }
  return false;
};

module.exports = mongoose.model('Scheduler', SchedulerSchema);
