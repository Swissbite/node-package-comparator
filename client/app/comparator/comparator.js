'use strict';

angular.module('NodePackageComparator')
  .config(function ($stateProvider) {
    $stateProvider
      .state('comparator', {
        url: '/?keyword',
        templateUrl: 'app/comparator/comparator.html',
        controller: 'ComparatorCtrl as comparator'
      });
  });
