/* global angular */
(function() {
    'use strict';

    angular.module('navigation', [])
        .directive('initiativesNav', function() {
            return {
                restrict: 'A',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.links = [
                        {href: '/', name: 'Nousijat'},
                        {href: '/lista/kannatetuimmat/100', name: 'Kannatetuimmat'},
                        {href: '/lista/paattyneet/100', name: 'Päättyneet'},
                        {href: '/graafi', name: 'Graafi (6kk)'},
                        {href: '/tilastot', name: 'Tilastot'}
                    ];
                    $scope.location = $location;
                }],
                templateUrl: '/templates/initiatives-nav.html'
            };
        });
}());