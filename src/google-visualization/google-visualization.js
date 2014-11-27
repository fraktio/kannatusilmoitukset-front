/* global angular */
define([], function() {
    'use strict';

    angular.module('google-visualization', [])
        .factory('GoogleVisualization', ['$q', function($q) {
            return $q(function(resolve) {
                require(['//www.google.com/jsapi'], function() {
                    window.google.load('visualization', '1', {
                        packages: ['corechart'],
                        callback: function() {
                            resolve(window.google.visualization);
                        }
                    });
                });
            });
        }]);
});
