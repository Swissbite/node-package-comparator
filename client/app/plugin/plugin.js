'use strict';

angular.module('npmpluginComperatorApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('plugin', {
        url: '/plugin',
        templateUrl: 'app/plugin/plugin.html',
        controller: 'PluginCtrl'
      });
  });