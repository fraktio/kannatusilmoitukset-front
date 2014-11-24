/* global angular */
define([], function () {
    'use strict';

    angular.module('initiatives-list', ['ngRoute', 'data', 'angular-bacon'])
        .directive('initiativesList', function() {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    initiatives: '=',
                    list: '='
                },
                templateUrl: '/initiatives-list/initiatives-list.html',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.showInitiative = function(initiative) {
                        $location.path(initiative.localUrl);
                    };
                }]
            };
        });
});
