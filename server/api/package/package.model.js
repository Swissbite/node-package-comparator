'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PluginSchema = new Schema({
  name: {type: String, unique: true, index:true},
  description: String,
  version: String,
  readme: String,
  author: String,
  lastModified: {type: Date, index: true},
  github: String,
  keywords: {type: [String], index: true},
  npmStars: Number,
  githubForks: {type: Number, index: true},
  githubStars: {type: Number, index: true}
});

module.exports = mongoose.model('Package', PluginSchema);
