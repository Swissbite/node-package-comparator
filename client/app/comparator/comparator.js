'use strict';

angular.module('npmpluginComperatorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('comparator', {
        url: '/',
        templateUrl: 'app/comparator/comparator.html',
        controller: 'ComparatorCtrl as comparator'
      });
  });
