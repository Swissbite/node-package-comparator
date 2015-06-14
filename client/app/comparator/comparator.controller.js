'use strict';

angular.module('NodePackageComparator')
  .controller('ComparatorCtrl',
  function ($scope, $stateParams, $state, $filter, $log, $interval, NodePackage) {
    var me = this;

    var queryObj = {
      limit: 10,
      skip: 0,
      sorts: [],
      keyword: $stateParams.keyword
    };
    var placeholderTextes = ['Enter a keyword', 'Try mongoose', 'Packages for mongodb?', 'You could search for grunt',
                             'Only one keyword at a time'];
    var placeholderCounter = 0;
    var interval;
    var sortMap = {};

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

    function nextQuery() {
      me.isLoading = true;
      //me.data = [];
      NodePackage.nextQuery(queryObj).$promise.then(function (res) {
        me.isLoading = false;
        console.log(res);
        me.data = res;
        if (res.results.length === 0) {
          me.pagination.currentPage = 1;
        }
      });
    }

    function changeSortDirection(field, event) {
      var isShiftSet = event.shiftKey;
      var index = sortMap[field];
      if (!angular.isNumber(index)) {
        if (!isShiftSet) {
          queryObj.sorts = [{field: field, ascending: true}];
          sortMap = {};
        }
        else {
          queryObj.sorts.push({field: field, ascending: true});
        }
        sortMap[field] = queryObj.sorts.length - 1;
      }
      else if (queryObj.sorts[index].ascending) {
        queryObj.sorts[index].ascending = false;
      }
      else {
        queryObj.sorts.splice(index, 0);
        delete sortMap[field];
      }
      //$log.debug('change sort', sortMap, queryObj.sorts);
      nextQuery();
    }


    function isSortSet(field, ascending) {

      var index = sortMap[field];
      if (angular.isUndefined(index)) {
        return void 0;
      }
      var toReturn = queryObj.sorts[index].ascending === ascending;
      //$log.debug('isSortSet', index, queryObj.sorts[index], ascending, toReturn);
      return toReturn;
    }

    nextQuery();

    $scope.searchTerm = $stateParams.keyword;

    me.pagination = {
      limit: queryObj.limit,
      currentPage: 1,
      maxSize: 5
    };

    me.changeSortDirection = changeSortDirection;
    me.isSortSet = isSortSet;

    $scope.$watchGroup(['filter.name', 'filter.description', 'filter.author'], function (newValues) {
      queryObj.filters = {
        name: newValues[0],
        description: newValues[1],
        author: newValues[2]
      };
      nextQuery();
    });

    $scope.$watch('comparator.pagination.currentPage', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        queryObj.skip = queryObj.limit * (newVal - 1);
        nextQuery();
      }
    });
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
