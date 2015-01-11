'use strict';

angular.module('npmpluginComperatorApp').
  value('packageURLBase', '/api/packages')
  .factory('Package', function (packageURLBase, $resource) {
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
      }
    });
  });
