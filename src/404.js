/* global angular */
(function() {
    'use strict';

    angular.module('404', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider', '$compileProvider',
            function($routeProvider, $locationProvider, $compileProvider) {
                $routeProvider.otherwise({redirectTo: '/'});
                $locationProvider.html5Mode(true);
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
            }
        ]);
}());
