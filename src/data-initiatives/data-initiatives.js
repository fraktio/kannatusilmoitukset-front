/* global angular, _ */
define(['data-initiative/data-initiative'], function() {
    'use strict';

    angular.module('data-initiatives', ['data-initiative'])
        .factory('ListData', ['$http', 'fillInitiative', function($http, fillInitiative) {
            return $http.get('/initiatives/img/meta.json').then(function(res) {
                return _(res.data).map(fillInitiative);
            });
        }])
        .factory('histories', ['ListData', 'history', '$q', function(ListData, history, $q) {
            return function(inputInitiatives) {
                var initiatives = inputInitiatives ? $q(function(resolve) { resolve(inputInitiatives); }) : ListData;

                return initiatives.then(function(initiatives) {
                    return $q.all(_(initiatives).map(history));
                });
            };
        }]);
});
