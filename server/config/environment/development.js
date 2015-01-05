'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options

  mongo: {
    uri: 'mongodb://localhost/npmplugincomperator-dev'
  },
  registry: {
    uri: 'http://localhost:5984/registry/',
    designDocumentPath: '_design/app/',
    byKeywordView: '_view/byKeyword'

  },
  seedDB: true
};
