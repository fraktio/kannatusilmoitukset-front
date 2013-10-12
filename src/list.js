/* global angular, _ */
(function() {
    angular.module('lists', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', 'Data', function($scope, Data) {
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.num = 100;
                            $scope.header = {
                                fi: 'Viimeisten kahden viikon aikana kannatetuimmat aloitteet'
                            };
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return initiative && new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.header = {
                                fi: 'Koko keräysaikanaan kannatetuimmat aloitteet'
                            };
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                })
                .when('/lista/paattyneet/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.header = {
                                fi: 'Kannatetuimmat päättyneet aloitteet'
                            };
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) <= Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                });
        }]);
}());