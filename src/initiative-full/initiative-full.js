/* global angular, _, window, Bacon */
define(
    [
        'data-initiatives/data-initiatives',
        'initiative-graph/initiative-graph',
        'spinner-customized/spinner-customized'
    ], function() {
    'use strict';

    angular.module('initiative-full', ['ngRoute', 'data-initiatives', 'initiative-graph', 'spinner', 'angular-bacon'])
        .directive('initiativeFull', function () {
            return {
                templateUrl: '/initiative-full/initiative-full.html?1',
                controller: ['$routeParams', '$scope', 'ListData', 'history', '$location',
                    function($routeParams, $scope, ListData, history, $location) {
                        $scope.host = $location.host();
                        var id = 'https://www.kansalaisaloite.fi/api/v1/initiatives/' + $routeParams.id;
                        window._gaq.push(['_trackEvent', 'Initiatives', 'Open', id]);
                        Bacon.fromPromise(ListData)
                            .delay()
                            .map(function(initiatives) {
                                return _(initiatives).find(function(initiative) {
                                    return initiative.id === id;
                                });
                            })
                            .digest($scope, 'initiative')
                            .delay()
                            .map(history)
                            .flatMap(Bacon.fromPromise)
                            .digest($scope, 'initiative');
                    }]
            };
        });
});
