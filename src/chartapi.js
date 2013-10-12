(function() {
    angular.module('chartapi', []);
    // ...
}());
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
