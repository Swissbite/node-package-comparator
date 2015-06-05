'use strict';

angular.module('NodePackageComparator')
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

    function pointTooltipFormater() {
      // Remove jshint warning because this is the point itself in highcharts.
      /* jshint -W040 */
      var me = this, slice = 5;
      var text = '<p><b>' + me.y + '</b> keyword' + (me.y > 1 ? 's are' : ' is') + ' listed in <b>' + me.x + '</b> package' + (me.x > 1 ? 's' : '') + '.</p>';
      var list = '<ul>';
      angular.forEach(me.keywords.slice(0, slice), function (keyword) {
        list += '<li> <code>' + keyword + '</code></li>';
      });
      list += '</ul>';
      text += '<p><h6>';
      if (me.keywords.length > slice) {
        text += 'Keyword extract';
      }
      else {
        text += 'Keywords';
      }
      text += '</h6>' + list + '</p>';
      return text;
    }

    $scope.highchart = {
      options: {

        title: {
          text: 'Distribution of keywords in packages'
        },
        chart: {
          zoomType: 'x',
          type: 'areaspline'
        },
        plotOptions: {
          size: '80%'
        },
        xAxis: xAxis,
        yAxis: {
          title: {
            text: 'Keywords'
          },
          type: 'logarithmic',
          minorTickInterval: 0
        },
        navigator: navigator,
        tooltip: {
          pointFormatter: pointTooltipFormater,
          useHTML: true
        }
      },
      series: [statisticSerie],
      loading: true
    };
    $scope.isLoading = true;
    NodePackage.statistics().$promise.then(function (statistics) {
      $scope.stats = statistics;
      var chartData = [];
      angular.forEach(statistics.distribution, function (item) {
        chartData.push(
          {
            x: item._id, name: ' ',
            y: item.total,
            keywords: item.keys
          }
        );
      });
      $scope.isLoading = false;
      $scope.highchart.loading = false;
      statisticSerie.data = chartData;
      navigator.series.data = chartData;
      xAxis.max = chartData[chartData.length - 1][0];
    });

  });