/* global yepnope */
(function(){
    'use strict';

    window._gaq = [
        ['_setAccount', 'UA-37909592-1'],
        ['_trackPageview']
    ];

    var chartLoader = {
        charts: false,
        listeners: [],
        check: function() {
            if (!this.charts) {
                return;
            }
            var listener;
            while ((listener = this.listeners.pop()) !== undefined) {
                listener();
            }
        },
        gotCharts: function() {
            this.charts = true;
            this.check();
        },
        withCharts: function(listener) {
            this.listeners.push(listener);
            this.check();
        }
    };

    yepnope([
        {
            load: '//www.google.com/jsapi',
            callback: function() {
                google.load('visualization', '1', {packages:['corechart'], callback:function() {
                    chartLoader.gotCharts();
                }});
            }
        },
        {
            load: [
                window.hashres.app
            ],
            callback: function() {
                chartLoader.withCharts(function() {
                    angular.bootstrap(document, ['citizens-initiative']);
                });
            }
        }
    ]);
}());