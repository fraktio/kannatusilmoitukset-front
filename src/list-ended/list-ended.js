/* global angular, _, Bacon */
define(['citizens-initiatives/data', 'initiatives-list/initiatives-list'],
    function () {
    'use strict';

    angular.module('list-ended', ['ngRoute', 'data', 'angular-bacon', 'initiatives-list'])
        .directive('listEnded', function () {
            return {
                template:
                    '<h3>Kannatetuimmat päättyneet aloitteet<div facebook-share class="pull-right"></div></h3>' +
                    '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>',

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
                }]
            };
        });
});
