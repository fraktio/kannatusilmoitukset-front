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
                    controller: ['$scope', 'Data', function($scope, Data) {
                        $scope.num = 100;
                        $scope.header = {
                            fi: 'Viimeisten kahden viikon aikana kannatetuimmat aloitteet'
                        };

                        $scope.initiatives = Data.then(function(data) {
                            $scope.fastest = fastestTwoWeek(data);
                            return _.chain(data)
                                .filter(function(initiative) {
                                    return initiative && new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                })
                                .value();
                        });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.header = {
                            fi: 'Koko keräysaikanaan kannatetuimmat aloitteet'
                        };

                        $scope.initiatives = Data.then(function(data) {
                            $scope.fastest = fastestTwoWeek(data);
                            return _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                        });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/paattyneet/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.header = {
                            fi: 'Kannatetuimmat päättyneet aloitteet'
                        };
                        $scope.initiatives = [];

                        $scope.initiatives = Data.then(function(data) {
                            $scope.fastest = fastestTwoWeek(data);
                            return _.chain(data)
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
