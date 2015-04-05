'use strict';

angular.module('NodePackageComperatorApp').
  value('packageURLBase', '/api/nodepackages')
  .factory('NodePackage', function (packageURLBase, $resource) {
    return $resource(packageURLBase + '/:id', {id: '@_id'}, {
      byKeyword: {
        isArray: true,
        url: packageURLBase + '/byKeyword/:keyword',
        params: {keyword: '@keyword'},
        method: 'GET'
      },
      byName: {
        isArray: false,
        url: packageURLBase + '/byName/:name',
        params: {name: '@name'},
        method: 'GET'
      },
      statistics: {
        isArray: false,
        params: {id: 'statistics'},
        method: 'GET'
      }
    });
  });
