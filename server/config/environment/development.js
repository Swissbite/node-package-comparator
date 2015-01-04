'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options

  mongo: {
    uri: 'mongodb://local-test:local-test-user-pw@ds047950.mongolab.com:47950/node-package-comperator-dev'
  },
  registry: {
    uri: 'http://localhost:5984/registry/',
    designDocumentPath: '_design/app/',
    byKeywordView: '_view/byKeyword'

  },
  seedDB: true
};
