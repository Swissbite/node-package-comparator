/**
 * Created by david on 08.11.15.
 */
var child_process = require('child_process');
var Scheduler = require('./scheduler.model');
var _ = require('lodash');


var updaterChildProcess;
var currentRunning;
var queue = [];
var killChildTimeout;

function queueScheduler(scheduler) {
  if (_.findIndex(queue, scheduler) < 0) {
    queue.push(scheduler);
  }
  console.log('queue length: ', queue.length);
  console.log('first elem', queue[0]);
  console.log('currentRunning', currentRunning);
  if (!currentRunning) {
    nextSchedule();
  }
}

function nextSchedule() {
  currentRunning = queue.shift();
  if (currentRunning) {
    console.log(killChildTimeout);
    clearTimeout(killChildTimeout);
    killChildTimeout = undefined;
    createChildProcessIfNotExists();
    updaterChildProcess.send(currentRunning);
  }
  else if (!currentRunning && !killChildTimeout) {
    killChildTimeout = setTimeout(function killProcess() {
      console.log('child process idle timeout reached.');
      updaterChildProcess.kill('SIGKILL');
      updaterChildProcess = undefined;
    }, 10000);
  }
}

function updateKeywords() {
  console.log('Update Keywords');
  queueScheduler({type: 'keywords'});
}

function onMessage(msg) {
  if (msg.updateFinished) {
    nextSchedule();
  }
}

function updatePackage(packageKeyword) {
  queueScheduler({type: 'package', keyword: packageKeyword});
}

function createChildProcessIfNotExists() {
  if (!updaterChildProcess) {
    updaterChildProcess = child_process.fork(__dirname + '/updateAsChildProcess', [], {execArgv: ['--debug=5859']});
    updaterChildProcess.on('message', onMessage);
  }
}

createChildProcessIfNotExists();

module.exports = {
  updateKeywords: updateKeywords,
  updatePackage: updatePackage
};