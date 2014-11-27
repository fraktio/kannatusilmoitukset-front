/* global angular */
define(['data-initiatives/data-initiatives'], function () {
    'use strict';

    angular.module('initiatives-list', ['ngRoute', 'data-initiatives', 'angular-bacon'])
        .directive('initiativesList', function() {
            return {
                restrict: 'E',
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
