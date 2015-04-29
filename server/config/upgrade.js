/**
 * Created by david on 05.03.15.
 */

var Setting = require('../api/setting/setting.model');
var nodePackage = require('../api/nodePackage/nodepackage.model');
var Scheduler = require('../api/scheduler/scheduler.model');
var _ = require('lodash');
var async = require('async');
var upgradeFunctions = [];

upgradeFunctions.push(function lowercaseKeywords(cb) {
  nodePackage.find().exec(function (err, nodePackages) {
    console.log('Start update nodePackages. NodePackages Found: ', nodePackages.length);
    var parallelSave = [];

    function createSaveStatement(nodePackage) {
      return function (cb) {
        if (!nodePackage._lastUpdate) {
          nodePackage.remove(function (err) {
            console.log('removed package', nodePackage.name);
            cb(err);
          });
        }
        else {
          nodePackage.save(function (err) {
            cb(err);
          });
        }
      }
    }

    _.forEach(nodePackages, function (nodePackage) {
      if (nodePackage.keywords && nodePackage.keywords.length > 0) {
        parallelSave.push(createSaveStatement(nodePackage));
      }
    });
    async.parallel(parallelSave, function (err) {
      console.log('Parallel finished');
      cb(err);
    })
  });
});

upgradeFunctions.push(function clearAllExecSchedulers(cb) {
  Scheduler.update({type: 'package'}, {
    $unset: {
      active: '',
      lastRun: '',
      lastFinish: ''
    }
  }, {multi: true, strict: false}, cb);
});
upgradeFunctions.push(function clearAllPackageUpdateDates(cb) {
  nodePackage.update({}, {$unset: {_lastUpdate: ''}}, {multi: true, strict: false}, cb);
});

upgradeFunctions.push(function removeAllPackagesAndSchedulers(cb) {
  async.parallel({
    nodePackages: function (cb) {
      nodePackage.remove({}, cb);
    },
    schedulers: function (cb) {
      Scheduler.remove({}, cb);
    }
  }, function (err) {
    cb(err);
  });
});

upgradeFunctions.push(function updateGithubStarsForkesAndWatchesIfNotSet(cb) {
  function createUpdateFunctionWithCb(key) {
    var searchQry = {}, update = {};
    searchQry[key] = {$exists: false};
    update[key] = 0;
    return function (cb) {
      nodePackage.update(searchQry, update, {multi: true, strict: false}, cb);
    };
  }

  async.series([createUpdateFunctionWithCb('githubForks'), createUpdateFunctionWithCb('githubStars'),
                createUpdateFunctionWithCb('githubWatches')], function (err) {
    cb(err);
  });
});


function upgrade(cb) {
  console.log('Start upgrade');
  var settingName = 'UpgradeSteps';
  Setting.findOne({name: settingName}, function (err, upgradeSetting) {
    console.log('Current upgradeSetting: ', upgradeSetting);
    if (!upgradeSetting) {
      upgradeSetting = new Setting({
        name: settingName,
        info: 'Current upgrade steps installed.',
        editable: false,
        value: 0
      });
    }
    var steps = upgradeFunctions.slice(upgradeSetting.value);
    async.series(steps, function (err) {
      if (!err) {
        upgradeSetting.value = upgradeFunctions.length;
      }
      upgradeSetting.save();
      if (cb && 'function' === typeof cb) {

        cb(err);
      }
    });
  });
}

module.exports = upgrade;