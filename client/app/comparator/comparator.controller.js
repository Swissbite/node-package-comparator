'use strict';

angular.module('NodePackageComperatorApp')
  .controller('ComparatorCtrl', function ($scope, $stateParams, $state, $filter, $log, NodePackage, uiGridConstants) {
    var me = this;

    me.gridOptions = {
      enableFiltering: true,
      enableGridMenu: true,
      showGridFooter: true,
      columnDefs: [
        {name: 'name',
          field: 'name',
          cellTemplate: '<div><a ui-sref="package({id: row.entity._id})">{{row.entity.name}}</a></div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {name: 'description',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {name: 'author',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }},
        {name: 'version',enableFiltering: false},
        {name: 'lastModified', field: 'lastModifiedFormatted',enableFiltering: false, width: 120},
        {name: 'npmStars',enableFiltering: false, width: 80, displayName: 'Stars @ NPM'},
        {name: 'githubForks',enableFiltering: false, width: 80, displayName: 'Forks @ Github'},
        {name: 'githubStars',enableFiltering: false,  width: 80, displayName: 'Stars @ Github'},
        {name: 'githubWatches',enableFiltering: false, width: 80, displayName: 'Watches @ Github'}
      ]
    };

    me.comparableData = [];
    function formatDate(date) {
      return $filter('date')(date, 'yy-MM-dd HH:mm');
    }

    function compare(keyword) {
      if (keyword && keyword.length > 0) {
        NodePackage.byKeyword({keyword: keyword}).$promise.then(function (packages) {
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
          me.gridOptions.data = packages;

        });
      }
    }

    me.compare = compare;
    $log.log($stateParams);
    if ($stateParams.keyword) {
      $scope.searchTerm = $stateParams.keyword;
      compare($stateParams.keyword);
    }
  });
