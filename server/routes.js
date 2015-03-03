/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/settings', require('./api/setting'));
  app.use('/api/schedulers', require('./api/scheduler'));
  app.use('/api/nodepackages', require('./api/nodePackage'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      var path = app.get('appPath') + '/index.html', option = {root: __dirname + '/..'};
      if (res.sendFile) {
        res.sendFile(path, option);
      }
      else {
        res.sendfile(path, option);
      }
    });
};
