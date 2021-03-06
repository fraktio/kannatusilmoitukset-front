/* global angular, window */
define([], function () {
    'use strict';

    angular.module('facebook-share', [])
        .directive('facebookShare', function () {
            return {
                template: '<iframe scrolling="no" frameborder="0" allowTransparency="true"></iframe>',
                link: function (scope, element) {
                    element[0].children[0].src =
                        '//www.facebook.com/plugins/share_button.php?locale=fi_FI&href=' +
                        window.location +
                        '&layout=button&appId=1472730843000242';
                }
            };
        });
});
