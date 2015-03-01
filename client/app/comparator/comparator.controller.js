'use strict';

angular.module('NodePackageComperatorApp')
  .controller('ComparatorCtrl', function ($scope, $stateParams, $state, $filter, $log, $interval, NodePackage, uiGridConstants) {
    var me = this;

    var placeholderTextes=['Enter a keyword', 'Try mongoose', 'Packages for mongodb?', 'You could search for grunt', 'Only one keyword at a time'];
    var placeholderCounter = 0;
    var interval;
    function refreshPlaceholders() {
      if (placeholderCounter >= placeholderTextes.length) {
        placeholderCounter = 0;
      }
      $scope.keywordPlaceholder = placeholderTextes[placeholderCounter];
      placeholderCounter += 1;
    }

    function startInterval() {
      if (!interval) {
        interval = $interval(refreshPlaceholders, 2000);
      }
    }
    function stopInterval() {
      if (interval) {
        $interval.cancel(interval);
        interval = undefined;
      }
    }

    me.gridOptions = {
      enableFiltering: true,
      enableGridMenu: true,
      showGridFooter: true,
      columnDefs: [
        {
          name: 'name',
          displayName: 'Name',
          cellTemplate: '<div><a ui-sref="package({id: row.entity._id})">{{row.entity.name}}</a></div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'description',
          displayName: 'Description',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'author',
          displayName: 'Author',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {name: 'version', enableFiltering: false, width: 120, displayName: 'Version'},
        {name: 'lastModified', field: 'lastModifiedFormatted', enableFiltering: false, width: 120},
        {
          name: 'npmStars', enableFiltering: false, width: 80, displayName: 'Stars @ NPM', sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        }
        },
        {
          name: 'githubForks', enableFiltering: false, width: 80, displayName: 'Forks @ Github', sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }
        },
        {
          name: 'githubStars', enableFiltering: false, width: 80, displayName: 'Stars @ Github', sort: {
          direction: uiGridConstants.DESC,
          priority: 0
        }
        },
        {name: 'githubWatches', enableFiltering: false, width: 80, displayName: 'Watches @ Github'}
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
    $scope.$watch('searchTerm', function(newVal) {
      if (!newVal || newVal.length === 0) {
        if (!$scope.keywordPlaceholder) {
          refreshPlaceholders();
        }
        startInterval();
      } else {
        stopInterval();
      }
    });
  });
