'use strict';

angular.module('NodePackageComperatorApp')
  .controller('PackageCtrl', function ($scope, $stateParams, NodePackage) {
    $scope.package = NodePackage.get({id: $stateParams.id });
  });
