/* global angular, Bacon */
define(
    [
        'data-initiatives/data-initiatives',
        'google-visualization/google-visualization',
        'spinner-customized/spinner-customized'
    ],
    function() {
    'use strict';

    angular
        .module(
            'initiative-graph',
            ['ngRoute', 'data-initiatives', 'google-visualization', 'spinner', 'angular-bacon']
        )
        .directive('initiativeChartSingle', function() {
            return {
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {
                    initiative: '=initiative'
                },
                controller: ['$scope', 'drawSingle', 'GoogleVisualization',
                    function($scope, drawSingle, GoogleVisualization) {
                        var containerId = Bacon.constant('initiative-chart-fulltime');
                        GoogleVisualization = Bacon.fromPromise(GoogleVisualization);

                        var initiative =
                            Bacon.fromBinder(function(sink) {
                                $scope.$watch('initiative', function(value) {
                                    sink(new Bacon.Next(value));
                                });
                            });

                        Bacon.onValues(containerId, initiative, GoogleVisualization, drawSingle);
                    }],
                template: '<div ng-transclude></div>'
            };
        })
        .factory('drawSingle', ['$filter', function($filter) {
            return function(containerId, initiative, GoogleVisualization) {
                var startDate = new Date(initiative.startDate);

                var data = new GoogleVisualization.DataTable();
                data.addColumn('datetime', 'Time');
                data.addColumn('number', initiative.name.fill);
                data.addColumn({type:'boolean',role:'certainty'});
                data.addColumn({type:'string',role:'tooltip',p:{html:true}});

                var rows = [];
                angular.forEach(initiative.support, function(value) {
                    if (!value.hasOwnProperty('length') || value.length !== 2) {
                        return;
                    }
                    var val = value.slice(0);
                    val.push(true);
                    val.push(
                        '<div class="initiative-tooltip"><p>' +
                            '<span class="count">' + value[1] + '</span>' +
                            '<span class="date">' + $filter('date')(value[0], "dd.MM.yyyy HH:mm:ss") + '</span>' +
                            '</p></div>'
                    );
                    rows.push(val);
                });

                if (rows.length < 1) {
                    return;
                }

                rows.unshift([
                    startDate,
                    0,
                    false,
                    '<div class="initiative-tooltip"><p>' +
                        '<span class="count">0</span>' +
                        '<span class="date">' + $filter('date')(startDate, "dd.MM.yyyy HH:mm:ss") + '</span>' +
                        '</p></div>'
                ]);

                data.addRows(rows);

                var chart = new GoogleVisualization.ChartWrapper({
                    chartType: 'LineChart',
                    containerId: containerId,
                    dataTable: data
                });
                chart.setOptions({
                    'backgroundColor': 'white',
                    'hAxis': {
                        'format': 'MM.yyyy',
                        'minValue': new Date(initiative.startDate),
                        'maxValue': new Date(initiative.endDate),
                        'viewWindow': {
                            'min': new Date(initiative.startDate),
                            'max': new Date(initiative.endDate)
                        }
                    },
                    'vAxis': {
                        'minValue': 0,
                        'maxValue': Math.max(50000, initiative.currentTotal+10000),
                        'viewWindow': {
                            'min': 0,
                            'max': Math.max(50000, initiative.currentTotal+10000)
                        },
                        'gridlines': {
                            'count': 6
                        }
                    },
                    'legend': {
                        'position': 'none'
                    },
                    'chartArea': {
                        'top': 20,
                        'left': 60,
                        'width': '80%',
                        'height': '80%'
                    },
                    'tooltip': {
                        'isHtml': true
                    }
                });

                chart.draw();
            };
        }]);
});
