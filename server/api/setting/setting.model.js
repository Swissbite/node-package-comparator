'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Mixed = mongoose.Schema.Types.Mixed;

var SettingSchema = new Schema({
  name: {type: String, unique: true},
  info: String,
  value: Mixed,
  active: Boolean,
  editable: Boolean
});

module.exports = mongoose.model('Setting', SettingSchema);