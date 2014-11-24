/* global angular */
define(['../../bower_components/spin.js/spin'], function (Spinner) {
    'use strict';

    angular.module('spinner', [])
        .value('spinner', function(element) {
            new Spinner({
                lines: 9,
                length: 4,
                width: 5,
                radius: 13,
                corners: 1,
                rotate: 5,
                color: '#000',
                speed: 1,
                trail: 79,
                shadow: false,
                hwaccel: false,
                className: 'spinner',
                zIndex: 2e9,
                top: '200px',
                left: '50%'
            }).spin(element);
        })
        .directive('spinner', ['spinner', function(spinner) {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    spinner(element[0]);
                }
            };
        }]);
});
