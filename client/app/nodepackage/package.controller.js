'use strict';

angular.module('NodePackageComparator')
  .controller('PackageCtrl', function ($scope, $stateParams, NodePackage) {
    $scope.package = NodePackage.get({id: $stateParams.id });
  });
