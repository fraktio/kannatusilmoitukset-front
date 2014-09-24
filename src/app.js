/* global angular */
(function () {
    'use strict';

    define('app', ['locale', '404', 'lists', 'navigation', 'statistics', 'initiative', 'graph'], function () {
        angular.bootstrap(document, ['404', 'lists', 'navigation', 'statistics', 'initiative', 'graph']);
    });

    require(['app']);

    window._gaq = [
        ['_setAccount', 'UA-37909592-1'],
        ['_trackPageview']
    ];

    window.fbAsyncInit = function() {
        window.FB.init({
            appId: '1472730843000242',
            xfbml: true,
            version: 'v2.1'
        });
    };

    require([
        '//connect.facebook.net/en_US/sdk.js',
        '//www.google-analytics.com/ga.js'
    ]);
}());
