/* global angular, _, Bacon */
define(['data'], function () {
    'use strict';

    var fastestTwoWeek = function (initiatives) {
        return _.max(_(initiatives).map(function(initiative) {
            return initiative.twoWeekSupport;
        }));
    };

    angular.module('lists', ['ngRoute', 'data', 'angular-bacon'])
        .directive('initiativesList', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    initiatives: '=',
                    list: '='
                },
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.showInitiative = function(initiative) {
                        $location.path(initiative.localUrl);
                    };
                }],
                templateUrl: '/templates/list.html'
            };
        })
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', 'ListData', 'histories', function($scope, ListData, histories) {
                        $scope.list = {
                            fastest: 0
                        };

                        Bacon.fromPromise(ListData)
                            .delay()
                            .map(function(initiatives) {
                                return _(initiatives).filter(function(initiative) {
                                    return initiative && new Date(initiative.endDate) > Date.now();
                                });
                            })
                            .map(histories)
                            .flatMap(Bacon.fromPromise)
                            .map(function(initiatives) {
                                return _(initiatives).sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                });
                            })
                            .digest($scope, 'initiatives')
                            .delay()
                            .map(fastestTwoWeek)
                            .digest($scope, 'list.fastest');
                    }],
                    template:
                        '<h3>Viimeisten kahden viikon aikana kannatetuimmat aloitteet</h3>' +
                        '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>'
                })
                .when('/lista/kannatetuimmat/:num?', {
                    controller: ['$scope', 'ListData', 'histories', function($scope, ListData, histories) {
                        $scope.list = {
                            fastest: 0
                        };

                        Bacon.fromPromise(ListData)
                            .delay()
                            .map(function(initiatives) {
                                return _.chain(initiatives)
                                    .filter(function(initiative) {
                                        return new Date(initiative.endDate) > Date.now();
                                    })
                                    .sortBy(function(initiative) {
                                        return -initiative.currentTotal;
                                    })
                                    .value();
                            })
                            .digest($scope, 'initiatives')
                            .delay()
                            .map(histories)
                            .flatMap(Bacon.fromPromise)
                            .map(fastestTwoWeek)
                            .digest($scope, 'list.fastest');
                    }],
                    template:
                        '<h3>Koko keräysaikanaan kannatetuimmat aloitteet</h3>' +
                        '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>'
                })
                .when('/lista/paattyneet/:num?', {
                    controller: ['$scope', 'ListData', function($scope, ListData) {
                        $scope.list = {
                            hideTwoWeek: true
                        };

                        Bacon.fromPromise(ListData)
                            .delay()
                            .map(function(initiatives) {
                                return _.chain(initiatives)
                                    .filter(function(initiative) {
                                        return new Date(initiative.endDate) <= Date.now();
                                    })
                                    .sortBy(function(initiative) {
                                        return -initiative.currentTotal;
                                    })
                                    .value();
                            })
                            .digest($scope, 'initiatives');
                    }],
                    template:
                        '<h3>Kannatetuimmat päättyneet aloitteet</h3>' +
                        '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>'
                });
        }]);
});
