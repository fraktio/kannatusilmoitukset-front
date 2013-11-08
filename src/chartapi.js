/* global angular, yepnope, google */
(function() {
    'use strict';

    angular.module('chartapi', [])
        .factory('CoreCharts', ['$q', function($q) {
            var deferred = $q.defer();

            yepnope({
                load: '//www.google.com/jsapi',
                callback: function() {
                    google.load('visualization', '1', {
                        packages: ['corechart'],
                        callback: function() {
                            deferred.resolve();
                        }
                    });
                }
            });

            return deferred.promise;
        }]);
}());
