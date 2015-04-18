'use strict';

angular.module('NodePackageComparator').
  value('packageURLBase', '/api/nodepackages')
  .factory('NodePackage', function (packageURLBase, $resource) {
    return $resource(packageURLBase + '/:id', {id: '@_id'}, {
      nextQuery: {
        url: packageURLBase + '/new',
        method: 'GET',
        isArray: false
      },
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
