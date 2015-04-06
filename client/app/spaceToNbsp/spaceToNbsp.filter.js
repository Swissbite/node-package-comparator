'use strict';

angular.module('NodePackageComperatorApp')
  .filter('spaceToNbsp', function ($sanitize) {
    return function (input) {
      if (angular.isString(input)) {
        console.log($sanitize(input));
        return $sanitize(input).replace(/ /g, '&nbsp;');
      }
      return input;
    };
  });
