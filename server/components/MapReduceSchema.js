'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var Mixed = mongoose.Schema.Types.Mixed;

var MapReducedSchema = new Schema({
  _id: {type: Mixed, index: true},
  value: {type: Mixed, index: true}
});


module.exports = function (collection) {
  return mongoose.model(collection, MapReducedSchema);
}
