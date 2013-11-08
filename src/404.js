/* global angular */
(function() {
    'use strict';

    angular.module('404', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(true);
        }]);
}());
