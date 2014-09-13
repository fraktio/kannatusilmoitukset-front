/* global angular, _, window, google */
(function() {
    'use strict';

    angular.module('initiative', ['ngRoute', 'data', 'chartapi'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/:id/:pretty', {
                    controller: ['$routeParams', '$scope', 'ListData', 'history', '$location',
                        function($routeParams, $scope, ListData, history, $location) {
                            $scope.host = $location.host();
                            var id = 'https://www.kansalaisaloite.fi/api/v1/initiatives/' + $routeParams.id;
                            window._gaq.push(['_trackEvent', 'Initiatives', 'Open', id]);
                            $scope.initiative = ListData
                                .then(function(initiatives) {
                                    return _(initiatives).find(function(initiative) {
                                        return initiative.id === id;
                                    });
                                });
                            $scope.initiative.then(history);
                        }],
                    templateUrl: '/templates/initiatives-one.html'
                });
        }])
        .directive('initiativeChartSingle', function() {
            return {
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {
                    initiative: '=initiative'
                },
                controller: ['$scope', 'drawSingle', 'CoreCharts', function($scope, drawSingle, CoreCharts) {
                    $scope.$watch('initiative', function(initiative) {
                        if (!_.isObject(initiative) || !_.isString(initiative.id)) {
                            return;
                        }
                        CoreCharts.then(function() {
                            drawSingle('initiative-chart-fulltime', initiative);
                        });
                    });
                }],
                template: '<div ng-transclude></div>'
            };
        })
        .factory('drawSingle', ['$filter', function($filter) {
            return function(containerId, initiative) {
                if (!document.getElementById(containerId)) {
                    return;
                }

                var startDate = new Date(initiative.startDate);

                var data = new google.visualization.DataTable();
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

                var chart = new google.visualization.ChartWrapper({
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
}());
