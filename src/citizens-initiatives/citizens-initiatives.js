/* global angular */
(function () {
    'use strict';

    define(
        'app',
        [
            'ng-locale-finnish/ng-locale-finnish',
            'initiatives-navigation/initiatives-navigation',
            'facebook-share/facebook-share',
            'list-rising/list-rising',
            'list-top/list-top',
            'list-ended/list-ended',
            'initiative-full/initiative-full',
            'initiatives-graph/initiatives-graph',
            'initiatives-statistics/initiatives-statistics'
        ],
        function () {
            angular
                .module(
                    'citizens-initiatives',
                    [
                        'initiatives-navigation',
                        'facebook-share',
                        'list-rising',
                        'list-top',
                        'list-ended',
                        'initiative-full',
                        'initiatives-graph',
                        'initiatives-statistics'
                    ]
                )
                .config(['$routeProvider', '$locationProvider', '$compileProvider',
                    function($routeProvider, $locationProvider, $compileProvider) {
                        $routeProvider
                            .when('/', {template: '<div list-rising></div>'})
                            .when('/lista/kannatetuimmat/:num?', {template: '<div list-top></div>'})
                            .when('/lista/paattyneet/:num?', {template: '<div list-ended></div>'})
                            .when('/:id/:pretty', {template: '<div initiative-full></div>'})
                            .when('/graafi', {template: '<div initiatives-graph></div>'})
                            .when('/tilastot', {template: '<div initiatives-statistics></div>'})
                            .otherwise({redirectTo: '/'});

                        $locationProvider.html5Mode(true);
                        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
                    }
                ]);

            angular.bootstrap(document, ['citizens-initiatives']);
        }
    );

    require(['app']);

    window._gaq = [
        ['_setAccount', 'UA-37909592-1'],
        ['_trackPageview']
    ];

    require(['//www.google-analytics.com/ga.js']);
}());
