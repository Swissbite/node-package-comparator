'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options

  mongo: {
    uri: 'mongodb://localhost/nodepackagecomparator-dev'
  },
//  registry: {
//    uri: 'http://localhost:5984/registry/_design/app/_rewrite/'
//  },
  seedDB: true
};
