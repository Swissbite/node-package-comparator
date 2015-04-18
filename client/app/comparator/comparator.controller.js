'use strict';

angular.module('NodePackageComperatorApp')
  .controller('ComparatorCtrl',
  function ($scope, $stateParams, $state, $filter, $log, $interval, NodePackage, uiGridConstants) {
    var me = this;

    var placeholderTextes = ['Enter a keyword', 'Try mongoose', 'Packages for mongodb?', 'You could search for grunt',
                             'Only one keyword at a time'];
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

    $scope.sorDirections = [
      {label: 'Name', key: 'name'},
      {label: 'Description', key: 'description'},
      {label: 'Author', key: 'author'},
      {label: 'Version', key: 'version'},
      {label: 'Last Modified', key: 'lastModified'},
      {label: 'Stars @ NPM', key: 'npmStars'},
      {label: 'Forks @ Github', key: 'githubForks'},
      {label: 'Stars @ Github', key: 'githubStars'},
      {label: 'Watches @ Github', key: 'githubWatches'}
    ];
    me.paging = {
      currentPage: 1,
      pageLimit: 10,
      currentPageResults: [],
      count: 0,
      sort: {labels: 'Stars @ Github', keys: 'githubStars'},
      asc: false
    };

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

    function errorFnOnRequest() {
      console.log(arguments);
      $scope.isLoading = false;
      me.gridOptions.data = [];
    }


    function compare(keyword) {
      if (keyword && keyword.length > 0) {
        $scope.isLoading = true;
        NodePackage.byKeyword({keyword: keyword}).$promise.then(function (packages) {
          angular.forEach(packages, function (elem) {
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
          $scope.isLoading = false;

        }, errorFnOnRequest);
      }
    }

    me.compare = compare;
    $log.log($stateParams);
    if ($stateParams.keyword) {
      $scope.searchTerm = $stateParams.keyword;
      compare($stateParams.keyword);
    }
    else {
      $scope.isLoading = true;
      NodePackage.query().$promise.then(function (packages) {
        me.gridOptions.data = packages;
        angular.forEach(packages, function (elem) {
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
        $scope.isLoading = false;
      }, errorFnOnRequest);
    }
    $scope.$watch('searchTerm', function (newVal) {
      if (!newVal || newVal.length === 0) {
        if (!$scope.keywordPlaceholder) {
          refreshPlaceholders();
        }
        startInterval();
      }
      else {
        stopInterval();
      }
    });
  });
