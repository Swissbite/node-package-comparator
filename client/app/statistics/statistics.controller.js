'use strict';

angular.module('NodePackageComperatorApp')
  .controller('StatisticsCtrl', function ($scope, NodePackage) {
    var statisticSerie = {
      name: 'Keyword Distribution',
      data: [],
      dataGrouping: {
        smoothed: true
      },
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        style: {
          fontSize: '13px'
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
    var navigator = {
      enabled: true,
      adaptToUpdatedData: false,
      series: {
        data: [],
        dataGrouping: {
          enabled: false
        }
      },
      xAxis: xAxis
    };


    $scope.highchart = {
      options: {

        title: {
          text: 'Distribution of keywords in packages'
        },
        chart: {
          zoomType: 'x',
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