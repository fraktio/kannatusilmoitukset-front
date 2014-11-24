/* global angular */
define([], function() {
    'use strict';

    angular.module('google-visualization', [])
        .factory('GoogleVisualization', ['$q', function($q) {
            var deferred = $q.defer();

            require(['//www.google.com/jsapi'], function() {
                window.google.load('visualization', '1', {
                    packages: ['corechart'],
                    callback: function() {
                        deferred.resolve(window.google.visualization);
                    }
                });
            });

            return deferred.promise;
        }]);
});
