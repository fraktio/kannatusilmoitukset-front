/* global angular */
(function() {
    'use strict';

    angular.module('initiatives-navigation', [])
        .directive('initiativesNavigation', function() {
            return {
                restrict: 'A',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.links = [
                        {href: '/', name: 'Nousijat'},
                        {href: '/lista/kannatetuimmat/', name: 'Kannatetuimmat'},
                        {href: '/lista/paattyneet/', name: 'Päättyneet'},
                        {href: '/graafi', name: 'Graafi (6kk)', mobileHide: true},
                        {href: '/tilastot', name: 'Tilastot', mobileHide: true}
                    ];
                    $scope.location = $location;
                }],
                templateUrl: '/initiatives-navigation/initiatives-navigation.html'
            };
        });
}());
