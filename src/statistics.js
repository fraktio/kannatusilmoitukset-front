/* global angular, _, yepnope, Morris, window, jQuery */
(function() {
    'use strict';

    angular.module('statistics', ['ngRoute', 'data'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/tilastot', {
                    controller: ['$scope', 'Data', function($scope, Data) {
                        Data.then(function(initiatives) {
                            var drawStatistics = function() {
                                $scope.weekdayDonut = new Morris.Donut({
                                    element: jQuery('.statistics .weekday'),
                                    data: _(initiatives).reduce(function(data, initiative) {
                                        _(initiative.support).each(function(value, index, list) {
                                            if (index !== 0) {
                                                data[value[0].getDay()].value += value[1] - list[index-1][1];
                                            }
                                        });
                                        return data;
                                    }, [
                                        {label: 'Sunnuntai', value: 0},
                                        {label: 'Maanantai', value: 0},
                                        {label: 'Tiistai', value: 0},
                                        {label: 'Keskiviikko', value: 0},
                                        {label: 'Torstai', value: 0},
                                        {label: 'Perjantai', value: 0},
                                        {label: 'Lauantai', value: 0}
                                    ])
                                });
                                $scope.hourLine = new Morris.Line({
                                    element: jQuery('.statistics .hour'),
                                    data: _(initiatives).reduce(function(data, initiative) {
                                        _(initiative.support).each(function(value, index, list) {
                                            if (index !== 0) {
                                                data[value[0].getHours()].value += value[1] - list[index-1][1];
                                            }
                                        });
                                        return data;
                                    }, _.map(_.range(24), function(num) {
                                        return {label: '' + num, value: 0};
                                    })),
                                    xkey: 'label',
                                    ykeys: ['value'],
                                    labels: ['Kannatusilmoituksia'],
                                    hideHover: 'auto',
                                    parseTime: false,
                                    axes: false,
                                    grid: false
                                });
                            };
                            if (_([window.jQuery, window.Raphael, window.Morris]).some(_.isUndefined)) {
                                yepnope({
                                    load: [
                                        '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.css',
                                        '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
                                        '//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',
                                        '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.js'
                                    ],
                                    complete: drawStatistics
                                });
                            } else {
                                drawStatistics();
                            }
                        });
                    }],
                    templateUrl: '/templates/statistics.html'
                });
        }]);
}());
