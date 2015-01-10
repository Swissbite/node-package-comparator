'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PackageSchema = new Schema({
  name: {type: String, unique: true, index:true},
  description: String,
  version: String,
  readme: String,
  author: String,
  lastModified: {type: Date, index: true},
  github: {
    account: String,
    project: String
  },
  keywords: {type: [String], index: true},
  npmStars: Number,
  githubForks: {type: Number, index: true},
  githubStars: {type: Number, index: true}
});

/**
 * @typedef Package
 * @type {Model}
 * @property {string} name - Unique name of package.
 * @property {string} description - Description of package.
 * @property {string} version - latest version.
 * @property {string} readme - Readme of package
 * @property {string} author - Name of the package author.
 * @property {Object} github - github account and project info.
 * @property {Array<string>} keywords - All known keywords.
 * @property {number} npmStars - Stars on NPM
 * @property {number} githubForks - Number of forks on github.
 * @property {number} githubStars - Number of stars on github.
 */
var Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
