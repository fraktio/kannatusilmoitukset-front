/* global angular, _ */
(function() {
    angular.module('lists', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/graafi', {
                    controller: ['$scope', '$location', 'Graph', function($scope, $location, Graph) {
                        spinner(document.getElementById('chart_div'));
                        Graph.setLocationSetter(function(path) {
                            $location.path(path);
                        });
                        Graph.drawWithData('chart_div');
                    }],
                    template: document.getElementById('initiatives-all.html').innerHTML
                });
        }])
        .factory('Data', ['$resource', '$filter', function($resource, $filter) {
            var Resource = $resource('/initiatives-sorted-streaked.json');

            var data = null;
            var Data = Resource.get({}, function() {
                data = _(angular.copy(Data))
                    .map(function(initiative, key){
                        if (!_.isObject(initiative) || key === '$promise') {
                            return null;
                        }
                        return fillInitiative(initiative, key);
                    }).filter(_.identity);
            });

            var formIdPos = function(initiatives) {
                var idPos = _.chain(initiatives)
                    .map(function(initiative) {
                        return [initiative.id, null];
                    })
                    .flatten()
                    .value();
                idPos.unshift('Time');
                return idPos;
            };

            var formNames = function(initiatives) {
                var names = _.map(initiatives, function(initiative) {
                    return initiative.name.fi;
                });
                names.unshift('Time');
                return names;
            };

            return {
                withData: function(cb) {
                    Data.$promise.then(function() {
                        cb(data);
                    });
                },
                googleDataArray: function(data) {
                    var initiatives = _.chain(angular.copy(data))
                        .filter(function(initiative) {
                            return new Date(initiative.endDate) > Date.now();
                        })
                        .sortBy(function(initiative) {
                            return -initiative.currentTotal;
                        })
                        .value();

                    var idPos = formIdPos(initiatives);

                    var dailySupports = new Array(180);
                    for (var i = 0; i < 180; i += 1) {
                        dailySupports[i] = new Array(idPos.length);
                        dailySupports[i][0] = new Date(Date.now() - (179-i)*24*60*60*1000);
                        for (var j = 1; j < idPos.length; j += 1) {
                            dailySupports[i][j] = null;
                        }
                    }
                    angular.forEach(initiatives, function(initiative) {
                        var index = idPos.indexOf(initiative.id);
                        angular.forEach(initiative.dailySupport, function(count) {
                            var time = count[0];
                            count = count[1];

                            if (!time || !count) {
                                return;
                            }

                            var daysBefore = Math.floor((Date.now() - time)/(24*60*60*1000));

                            if (daysBefore > 179) {
                                return;
                            }

                            dailySupports[179 - daysBefore][index] = count;
                            dailySupports[179 - daysBefore][index+1] =
                                '<div class="initiative-tooltip"><p>' +
                                    '<span class="count">' + count + '</span>' +
                                    '<span class="date">' + $filter('date')(time, "dd.MM.yyyy") + '</span>' +
                                    '</p><p class="name">' + initiative.name.fi + '</p></div>';
                        });
                    });
                    var chartData = _.values(dailySupports);
                    chartData.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    chartData[0] = formNames(initiatives);

                    return {chart: chartData, idPos: idPos};
                }
            };
        }])
        .factory('Graph', ['Data', '$filter', function(Data, $filter) {
            var wrapper = null;
            var locationSetter = null;
            var Graph = {
                setLocationSetter: function(setter) {
                    locationSetter = setter;
                },

                drawWithData: function(containerId) {
                    Data.withData(function(data) {
                        Graph.draw(data, containerId);
                    });
                },
                draw: function(data, containerId) {
                    if (document.getElementById(containerId).childElementCount > 1) {
                        return;
                    }

                    data = Data.googleDataArray(data);

                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('datetime', data.chart[0][0]);
                    for (var i = 1; i < data.chart[0].length; i += 1) {
                        dataTable.addColumn('number', data.chart[0][i]);
                        dataTable.addColumn({type:'string',role:'tooltip',p:{html:true}});
                    }

                    data.chart[0] = null;

                    dataTable.addRows(data.chart);
                    wrapper = new google.visualization.ChartWrapper({
                        chartType: 'LineChart',
                        containerId: containerId,
                        dataTable: dataTable
                    });
                    wrapper.setOptions({
                        'backgroundColor': 'whiteSmoke',
                        'chartArea': {
                            'top': 10,
                            'left': 65
                        },
                        'hAxis': {
                            'format': 'MM.yyyy'
                        },
                        'vAxis': {
                            'maxValue': 100000,
                            'ticks': [
                                {v: 100, f: '100'},
                                {v: 1000, f: '1000'},
                                {v: 10000, f: '10000'},
                                {v: 50000, f: '50000'},
                                {v: 100000, f: '100000'}
                            ],
                            'baseline': 50,
                            'logScale': true
                        },
                        'tooltip': {
                            'isHtml': true
                        },
                        'interpolateNulls': true
                    });

                    google.visualization.events.addListener(wrapper, 'select', function() {
                        if (wrapper.getChart().getSelection().length < 1) {
                            return;
                        }
                        var id = data.idPos[wrapper.getChart().getSelection()[0].column];

                        wrapper.getChart().setSelection(null);

                        Data.withData(function(data) {
                            locationSetter(
                                '/' + id.match(/\d+$/)[0] + '/' +
                                    prettyUrlText(
                                        _(data).find(function(initiative) { return initiative.id === id; }).name.fi
                                    )
                            );
                        });
                    });

                    wrapper.draw();
                }
            };
            return Graph;
        }]);
}());