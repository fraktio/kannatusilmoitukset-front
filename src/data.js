/* global angular, _ */
(function() {
    'use strict';

    var timeParser = function(time) {
        return function(start, length) {
            return parseInt(time.substr(start, length), 10);
        };
    };

    var initiativeSupportArray = function(initiative) {
        var support = [];
        angular.forEach(initiative.totalSupportCount, function(value, time) {
            time = timeParser(time);
            time = new Date(time(0, 4), time(4, 2) - 1, time(6, 2), time(9, 2));
            support.push([time, value]);
        });
        return support;
    };

    var initiativeDailySupportArray = function(initiative) {
        return _.chain(initiative.totalSupportCount)
            .map(function(value, time) {
                time = timeParser(time);
                time = (new Date(time(0, 4), time(4, 2) - 1, time(6, 2))).getTime();
                return [time, value];
            })
            .uniq(true, function(value) {
                return value[0];
            })
            .value();
    };

    var timeSupport = function(initiative, time) {
        var i = initiative.support.length - 1;
        var last = initiative.support[i];
        while (i > 0 && (last[0] - initiative.support[i][0]) < time) {
            i -= 1;
        }
        return last[1] - initiative.support[i][1];
    };

    var prettyUrlText = function(text) {
        return text.split(' ').slice(0,5).join(' ')
            .toLowerCase()
            .replace(/[äå]/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9]+/g, '-');
    };

    var fillInitiative = function(initiative, id) {
        if (typeof initiative !== 'object') {
            return null;
        }
        if (!initiative.hasOwnProperty('support')) {
            initiative = _(initiative).extend({
                id: id,
                support: initiativeSupportArray(initiative),
                dailySupport: initiativeDailySupportArray(initiative),
                totalPercentage: Math.min(100, initiative.currentTotal / 500),
                url: 'https://www.kansalaisaloite.fi/fi/aloite/' + id.match(/\d+$/)[0],
                donePercentage: Math.floor((
                    (Date.now() - new Date(initiative.startDate)) /
                        (new Date(initiative.endDate) - new Date(initiative.startDate))
                    )*100
                ),
                localUrl: '/' + id.match(/\d+$/)[0] + '/' + prettyUrlText(initiative.name.fi)
            });
            initiative.twoWeekSupport = timeSupport(initiative, 1000*60*60*24*14);
        }
        return initiative;
    };

    angular.module('data', [])
        .factory('Data', ['$http', function($http) {
            return $http.get('/initiatives-sorted-streaked.json').then(function(res) {
                return _(res.data).map(fillInitiative).filter(_.identity);
            });
        }]);
}());

