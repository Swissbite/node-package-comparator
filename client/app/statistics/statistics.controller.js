'use strict';

angular.module('NodePackageComperatorApp')
  .controller('StatisticsCtrl', function ($scope, NodePackage) {
    var statisticSerie = {
      name: 'Keyword Distribution',
      data: [],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        style: {
          fontSize: '13px'
        }
      }
    };
    var navigator = {
      enabled: true,
      adaptToUpdatedData: false,
      series: {
        data: [],
        dataGrouping: {
          enabled: true
        }
      }
    };

    var xAxis = {
      type: 'linear',
      min: 1,
      allowDecimals: false,
      title: {
        text: 'Listed in packages'
      }
    };

    $scope.highchart = {
      options: {
        title: {
          text: 'Distribution of keywords in packages'
        },
        chart: {
          type: 'areaspline'
        },
        xAxis: xAxis,
        yAxis: {
          title: {
            text: 'Keywords'
          },
          type: 'logarithmic',
          minorTickInterval: 0
        },
        navigator: navigator
      },
      series: [statisticSerie],
      loading: true
    };
    NodePackage.statistics().$promise.then(function (statistics) {
      $scope.stats = statistics;
      var chartData = [];
      angular.forEach(statistics.distribution, function (item) {
        chartData.push([item._id, item.total]);
      });
      $scope.highchart.loading = false;
      statisticSerie.data = chartData;
      navigator.series.data = chartData;
      xAxis.max = chartData[chartData.length - 1][0];
    });

  });