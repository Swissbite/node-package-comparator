'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NodePackageSchema = new Schema({
  name: {type: String, unique: true, index:true},
  description: String,
  version: String,
  readme: String,
  readmeFile: String,
  author: String,
  lastModified: {type: Date, index: true, spatial: true},
  github: {
    account: String,
    project: String
  },
  keywords: {type: [{type: String, lowercase: true}], index: true},
  npmStars: {type: Number, index: true, default: 0},
  githubForks: {type: Number, index: true, default: 0},
  githubStars: {type: Number, index: true, default: 0},
  githubWatches: {type: Number, index: true, default: 0},
  _lastUpdate: {type: Date, required: true, index: true}
});

/**
 * @typedef NodePackage
 * @type {Model}
 * @property {string} name - Unique name of nodePackage.
 * @property {string} description - Description of nodePackage.
 * @property {string} version - latest version.
 * @property {string} readme - Readme of nodePackage
 * @property {string} author - Name of the nodePackage author.
 * @property {Object} github - github account and project info.
 * @property {Array<string>} keywords - All known keywords.
 * @property {number} npmStars - Stars on NPM
 * @property {number} githubForks - Number of forks on github.
 * @property {number} githubStars - Number of stars on github.
 */
var Package = mongoose.model('NodePackage', NodePackageSchema);

module.exports = Package;
