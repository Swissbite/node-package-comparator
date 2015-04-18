'use strict';

angular.module('NodePackageComparator')
  .filter('spaceToNbsp', function ($sanitize) {
    return function (input) {
      if (angular.isString(input)) {
        return $sanitize(input).replace(/ /g, '&nbsp;');
      }
      return input;
    };
  });
