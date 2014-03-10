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
                    controller: ['$scope', 'ListData', 'history', '$q', function($scope, ListData, history, $q) {
                        $scope.num = 100;
                        $scope.header = {
                            fi: 'Viimeisten kahden viikon aikana kannatetuimmat aloitteet'
                        };

                        ListData.then(function(data) {
                            return _(data).filter(function(initiative) {
                                return initiative && new Date(initiative.endDate) > Date.now();
                            });
                        }).then(function(initiatives) {
                            var histories = _(initiatives).map(history);
                            $scope.fastest = $q.all(histories).then(function(initiatives) {
                                return fastestTwoWeek(initiatives);
                            });
                            $scope.initiatives = $q.all(histories).then(function(initiatives) {
                                return _(initiatives).sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                });
                            });
                        });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', 'ListData', 'history', '$q', function($scope, ListData, history, $q) {
                        $scope.header = {
                            fi: 'Koko keräysaikanaan kannatetuimmat aloitteet'
                        };

                        $scope.initiatives = ListData.then(function(data) {
                            return _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                        }).then(function(initiatives) {
                            var histories = _(initiatives).map(history);
                            $scope.fastest = $q.all(histories).then(function(initiatives) {
                                return fastestTwoWeek(initiatives);
                            });

                            return initiatives;
                        });
                    }],
                    templateUrl: '/templates/list.html'
                })
                .when('/lista/paattyneet/:num', {
                    controller: ['$scope', 'ListData', 'history', '$q', function($scope, ListData, history, $q) {
                        $scope.header = {
                            fi: 'Kannatetuimmat päättyneet aloitteet'
                        };
                        $scope.initiatives = [];

                        $scope.initiatives = ListData.then(function(data) {
                            return _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) <= Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                        }).then(function(initiatives) {
                            var histories = _(initiatives).map(history);
                            $scope.fastest = $q.all(histories).then(function(initiatives) {
                                return fastestTwoWeek(initiatives);
                            });

                            return initiatives;
                        });
                    }],
                    templateUrl: '/templates/list.html'
                });
        }]);
}());
