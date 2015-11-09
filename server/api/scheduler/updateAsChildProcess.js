// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var Scheduler = require('./scheduler.model');

var mongoose = require('mongoose');
var config = require('../../config/environment');

if (mongoose.connection.readyState === 0) {
  console.log('Mongo connection', config.mongo.uri, config.mongo.options);
  mongoose.connect(config.mongo.uri, config.mongo.options);
}

function messageHandler(msg) {
  console.log('Message Handler : ', msg);


  Scheduler.findOne(msg).then(function (scheduler) {
      if (scheduler) {
        return scheduler.run();
      }
      finishedRun();
    }, finishedRun)
    .then(finishedRun, finishedRun);
}

function finishedRun() {
  console.log('Message Handler: childprocess finished');
  process.send({updateFinished: true});
}

process.on('message', messageHandler);