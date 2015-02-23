'use strict';

angular.module('NodePackageComperatorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('package', {
        url: '/nodepackage/:id',
        templateUrl: 'app/nodepackage/package.html',
        controller: 'PackageCtrl'
      });
  });
