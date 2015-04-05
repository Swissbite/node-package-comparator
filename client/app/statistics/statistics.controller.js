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
    $scope.message = 'Hello';
    $scope.highchart = {
      options: {
        title: {
          text: 'Distribution of keywords in packages'
        },
        chart: {
          type: 'areaspline'
        }, xAxis: {
          type: 'category',
          title: {
            text: 'Listed in packages'
          }
        }, yAxis: {
          title: {
            text: 'Keywords'
          }
        }
      },
      series: [statisticSerie]
    };
    NodePackage.statistics().$promise.then(function (statistics) {
      $scope.stats = statistics;
      statisticSerie.data = [['In less than 10', statistics.countOfKeywordsLower10],
        ['Between 10 and 100', statistics.countOfKeywordsBetween10And100],
        ['Between 500 and 1000', statistics.countOfKeywordsBetween500And1000],
        ['In more than 1000', statistics.countOfKeywordsGreater1000]];
    });

  });
