/* global angular, _, Bacon */
define(['data-initiatives/data-initiatives', 'initiatives-list/initiatives-list'], function () {
    'use strict';

    var fastestTwoWeek = function (initiatives) {
        return _.max(_(initiatives).map(function(initiative) {
            return initiative.twoWeekSupport;
        }));
    };

    angular.module('list-top', ['ngRoute', 'data-initiatives', 'angular-bacon', 'initiatives-list'])
        .directive('listTop', function () {
            return {
                template:
                    '<h3>Koko keräysaikanaan kannatetuimmat aloitteet</h3>' +
                    '<initiatives-list initiatives="initiatives" list="list"></initiatives-list>',

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
                }]
            };
        });
});
