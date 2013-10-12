/* global angular, _ */
(function() {
    angular.module('lists', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider.otherwise({redirectTo: '/'});
            $locationProvider.html5Mode(true);
        }]);
}());