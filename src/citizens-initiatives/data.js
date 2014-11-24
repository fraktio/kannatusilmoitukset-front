/* global angular, _ */
define([], function() {
    'use strict';

    var timeParser = function(time) {
        return function(start, length) {
            return parseInt(time.substr(start, length), 10);
        };
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

    angular.module('data', [])
        .factory('ListData', ['$http', function($http) {
            var fillInitiative = function(initiative) {
                initiative = _(initiative).extend({
                    currentTotal: initiative.totalSupportCount,
                    token: initiative.id.match(/\d+$/)[0],
                    totalPercentage: Math.min(100, initiative.totalSupportCount / 500),
                    url: 'https://www.kansalaisaloite.fi/fi/aloite/' + initiative.id.match(/\d+$/)[0],
                    donePercentage: Math.floor((
                        (Date.now() - new Date(initiative.startDate)) /
                            (new Date(initiative.endDate) - new Date(initiative.startDate))
                        )*100
                    )
                });
                initiative.name.fill = _(initiative.name).chain().values().filter(_.identity).value()[0];
                initiative.localUrl = '/' + initiative.id.match(/\d+$/)[0] + '/' + prettyUrlText(initiative.name.fill);

                return initiative;
            };

            return $http.get('/initiatives/img/meta.json').then(function(res) {
                return _(res.data).map(fillInitiative);
            });
        }])
        .factory('historyData', ['$q', function($q) {
            var canvas = document.createElement('canvas');
            canvas.width = 96;
            canvas.height = 96;
            var context = canvas.getContext('2d');

            return function(initiative) {
                var deferred = $q.defer();
                var image = document.createElement('img');

                image.onload = function() {
                    context.drawImage(image, 0, 0);
                    initiative.data = context.getImageData(0, 0, image.width, image.height).data;
                    deferred.resolve(initiative);
                };

                image.src = '/initiatives/img/' + initiative.token + '.png';

                return deferred.promise;
            };
        }])
        .factory('history', ['historyData', '$q', '$filter', function(historyData, $q, $filter) {
            return function(initiative) {
                if (initiative.support) {
                    var deferred = $q.defer();
                    deferred.resolve(initiative);
                    return deferred.promise;
                }

                return historyData(initiative).then(function(initiative) {
                    var time = timeParser(initiative.startDate);
                    var startTime = Math.floor(new Date(time(0, 4), time(5, 2) - 1, time(8, 2)).getTime()/1000);

                    initiative.support = [];

                    for (var i = 0; i < 181*24; i += 1) {
                        var value = initiative.data[4*i]*256*256 + initiative.data[4*i+1]*256 + initiative.data[4*i+2];

                        if (!value) {
                            continue;
                        }

                        initiative.support.push([new Date((startTime + i*60*60)*1000), value]);
                    }

                    initiative.dailySupport =
                        _(initiative.support).chain()
                            .map(function(row) {
                                return [
                                    new Date(row[0].getFullYear(), row[0].getMonth(), row[0].getDate()).getTime(),
                                    row[1]
                                ];
                            })
                            .uniq(true, function(value) {
                                return value[0];
                            })
                            .value();
                    initiative.twoWeekSupport = timeSupport(initiative, 1000*60*60*24*14);

                    initiative.dailySupportCsv = function() {
                        return encodeURIComponent(
                            _(initiative.dailySupport).map(function(dailySupport) {
                                var daily = angular.copy(dailySupport);
                                daily[0] = '"' + $filter('date')(new Date(daily[0]), 'dd.MM.yyyy') + '"';
                                return daily.join(',');
                            }).join('\n')
                        );
                    };

                    return initiative;
                });
            };
        }])
        .factory('histories', ['ListData', 'history', '$q', function(ListData, history, $q) {
            return function(initiatives) {
                if (!initiatives) {
                    return ListData.then(function(initiatives) {
                        return $q.all(_(initiatives).map(history));
                    });
                }

                return $q.all(_(initiatives).map(history));
            };
        }]);
});
