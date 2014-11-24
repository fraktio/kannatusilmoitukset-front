/* global angular */
define([], function() {
    'use strict';

    angular.module('chartapi', [])
        .factory('CoreCharts', ['$q', function($q) {
            var deferred = $q.defer();

            require(['//www.google.com/jsapi'], function() {
                window.google.load('visualization', '1', {
                    packages: ['corechart'],
                    callback: function() {
                        deferred.resolve();
                    }
                });
            });

            return deferred.promise;
        }]);
});
