/* global angular, _, jQuery */
define(['data', 'spinner'], function() {
    'use strict';

    angular.module('statistics', ['ngRoute', 'data', 'spinner'])
        .factory('Morris', ['$q', function($q) {
            var deferred = $q.defer();

            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.css';
            document.getElementsByTagName("head")[0].appendChild(link);

            require(
                [
                    '//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js',
                    '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js'
                ],
                function (Raphael) {
                    window.Raphael = Raphael;
                    require(['//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.js'], function () {
                        deferred.resolve(window.Morris);
                    });
                }
            );

            return deferred.promise;
        }])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/tilastot', {
                    controller: ['$scope', 'histories', 'Morris', function($scope, histories, Morris) {
                        histories().then(function(initiatives) {
                            Morris.then(function(Morris) {
                                $scope.weekdayDonut = new Morris.Donut({
                                    element: jQuery('.statistics .weekday').html(''),
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
                                    element: jQuery('.statistics .hour').html(''),
                                    data: _(initiatives).reduce(function(data, initiative) {
                                        _(initiative.support).each(function(value, index, list) {
                                            if (index !== 0) {
                                                data[value[0].getHours()].value += value[1] - list[index-1][1];
                                            }
                                        });
                                        return data;
                                    }, _.map(_.range(24), function(num) {
                                        var format = function(hour) {
                                            hour = (24 + hour) % 24;
                                            return (hour < 10 ? '0' : '') + hour + ':00';
                                        };
                                        return {label: format(num - 1) + ' - ' + format(num), value: 0};
                                    })),
                                    xkey: 'label',
                                    ykeys: ['value'],
                                    labels: ['Kannatusilmoituksia'],
                                    hideHover: 'auto',
                                    parseTime: false,
                                    axes: false,
                                    grid: false
                                });
                            });
                        });
                    }],
                    templateUrl: '/templates/statistics.html'
                });
        }]);
});
