'use strict';

angular.module('NodePackageComperatorApp')
  .filter('spaceToNbsp', function () {
    return function (input) {
      if (angular.isString(input)) {
        return input.replace(/ /g, '&nbsp;');
      }
      return input;
    };
  });
