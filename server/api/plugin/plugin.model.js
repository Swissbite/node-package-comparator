'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PluginSchema = new Schema({
  name: {type: String, unique: true, index:true},
  description: String,
  version: String,
  words: String,
  author: String,
  date: String,
  github: String,
  time: String,
  keywords: [String],
  npmStars: Number,
  githubForks: {type: Number, index: true},
  githubStars: {type: Number, index: true}
});

module.exports = mongoose.model('Plugin', PluginSchema);
