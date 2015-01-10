'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all;
all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'npmplugin-comperator-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  github: {
    httpBase: {
      hostname: 'api.github.com',
      port: 443,
      headers: {
        'user-agent': 'node v.0.10'
      }
    },
    repoPathPrefix: '/repos/',
    forkPostfix: '/forks',
    starPostfix: '/stargazers',
    /**
     * Creates github path for repo.
     * @param {string} owner - project owner
     * @param {string} project
     * @param {string} postfix
     * @param {string} clientId
     * @param {string} clientSecret
     * @returns {string} api path.
     */
    createPath: function (owner, project, postfix, clientId, clientSecret) {
      var path = this.repoPathPrefix + owner + '/' + project;
      if (postfix && postfix.length > 0) {
        path += postfix;
      }
      if (clientId && clientSecret) {
        path += '?client_id=' + clientId + '&client_secret=' + clientSecret;
      }
      return path;
    }

  },
  registry: {
    uri: 'https://registry.npmjs.org/',
    byKeywordView: '-/_view/byKeyword',
    byStarPackageView: '-/_view/browseStarPackage'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
