'use strict';

angular.module('NodePackageComperatorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('comparator', {
        url: '/',
        templateUrl: 'app/comparator/comparator.html',
        controller: 'ComparatorCtrl as comparator'
      });
  });
