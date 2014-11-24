/* global angular, _, Bacon */
define(['citizens-initiatives/data', 'initiatives-list/initiatives-list'], function () {
    'use strict';

    var fastestTwoWeek = function (initiatives) {
        return _.max(_(initiatives).map(function(initiative) {
            return initiative.twoWeekSupport;
        }));
    };

    angular.module('list-rising', ['ngRoute', 'data', 'angular-bacon', 'initiatives-list'])
        .directive('listRising', function () {
            return {
                template:
                    '<h3>Viimeisten kahden viikon aikana kannatetuimmat aloitteet</h3>' +
                    '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>',

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
                }]
            };
        });
});
