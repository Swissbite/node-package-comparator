'use strict';

angular.module('NodePackageComperatorApp')
  .controller('ComparatorCtrl', function ($scope, $stateParams, $filter, Package) {
    var me = this;
    var gridOptions = {
      enableFiltering: true,
      enableGridMenu: true,
      showGridFooter: true,
      showColumnFooter: true,
      columnDefs: [
        {name: 'name'},
        {name: 'description'},
        {name: 'version'},
        {name: 'lastModified', field: 'lastModifiedFormatted'},
        {name: 'author'},
        {name: 'npmStars'},
        {name: 'githubForks'},
        {name: 'githubStars'},
        {name: 'githubWatches'}
      ],
      data: 'comparator.comparableData'
    };
    me.gridOptions = gridOptions;
    me.comparableData = [];
    function formatDate(date) {
      return $filter('date')(date, 'yy-MM-dd HH:mm');
    }
    function compare(keyword) {
      if (keyword && keyword.length > 0) {
        Package.byKeyword({keyword: keyword}).$promise.then(function (packages) {
          _.forEach(packages, function (elem) {
            if (!elem.hasOwnProperty('githubForks')) {
              elem.githubForks = 0;
            }
            if (!elem.hasOwnProperty('githubStars')) {
              elem.githubStars = 0;
            }
            if (!elem.hasOwnProperty('githubWatches')) {
              elem.githubWatches = 0;
            }
            elem.lastModifiedFormatted = formatDate(elem.lastModified);

          });
          me.comparableData = packages;
        });
      }
    }

    me.compare = compare;
    console.log($stateParams);
    if ($stateParams.keyword) {
      $scope.searchTerm = $stateParams.keyword;
      compare($stateParams.keyword);
    }

  });
