/* global angular, _ */
(function() {
    'use strict';

    var fastestTwoWeek = function (initiatives) {
        return _.max(_(initiatives).map(function(initiative) {
            return initiative.twoWeekSupport;
        }));
    };

    angular.module('lists', ['ngRoute', 'data'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', 'ListData', 'histories', function($scope, ListData, histories) {
                        $scope.header = {
                            fi: 'Viimeisten kahden viikon aikana kannatetuimmat aloitteet'
                        };
                        $scope.list = {
                            fastest: 0
                        };

                        $scope.initiatives = ListData
                            .then(function(initiatives) {
                                return _(initiatives).filter(function(initiative) {
                                    return initiative && new Date(initiative.endDate) > Date.now();
                                });
                            })
                            .then(histories)
                            .then(function(initiatives) {
                                return _(initiatives).sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                });
                            });

                        $scope.initiatives
                            .then(fastestTwoWeek)
                            .then(function(fastest) {
                                $scope.list.fastest = fastest;
                            });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', 'ListData', 'histories', function($scope, ListData, histories) {
                        $scope.header = {
                            fi: 'Koko keräysaikanaan kannatetuimmat aloitteet'
                        };
                        $scope.list = {
                            fastest: 0
                        };

                        $scope.initiatives = ListData.then(function(initiatives) {
                            return _.chain(initiatives)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                        });

                        $scope.initiatives
                            .then(histories)
                            .then(fastestTwoWeek)
                            .then(function(fastest) {
                                $scope.list.fastest = fastest;
                            });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/paattyneet/:num', {
                    controller: ['$scope', 'ListData', function($scope, ListData) {
                        $scope.header = {
                            fi: 'Kannatetuimmat päättyneet aloitteet'
                        };
                        $scope.list = {
                            hideTwoWeek: true
                        };

                        $scope.initiatives = ListData.then(function(initiatives) {
                            return _.chain(initiatives)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) <= Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                        });
                    }],
                    templateUrl: '/templates/list.html'
                });
        }]);
}());
