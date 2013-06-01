(function () {
    "use strict";

    var initiativeSupportArray = function(initiative) {
        var support = [];
        angular.forEach(initiative.totalSupportCount, function(value, time) {
            time = timeParser(time);
            time = new Date(time(0, 4), time(4, 2) - 1, time(6, 2), time(9, 2));
            support.push([time, value]);
        });
        return support;
    };
    var fillInitiative = function(initiative, id) {
        if (typeof(initiative) !== 'object') {
            return null;
        }
        if (!initiative.hasOwnProperty('support')) {
            initiative = _(initiative).extend({
                id: id,
                support: initiativeSupportArray(initiative),
                totalPercentage: Math.min(100, initiative.currentTotal / 500),
                url: 'https://www.kansalaisaloite.fi/fi/aloite/' + id.match(/\d+$/)[0],
                donePercentage: Math.floor((
                    (Date.now() - new Date(initiative.startDate)) /
                        (new Date(initiative.endDate) - new Date(initiative.startDate))
                    )*100
                ),
                localUrl: '/' + id.match(/\d+$/)[0] + '/' + prettyUrlText(initiative.name.fi)
            });
        }
        return initiative;
    };

    var prettyUrlText = function(text) {
        return text.split(' ').slice(0,5).join(' ')
            .toLowerCase()
            .replace(/[äå]/g, 'a')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9]+/g, '-');
    };

    var timeParser = function(time) {
        return function(start, length) {
            return parseInt(time.substr(start, length), 10);
        };
    };

    var spinner = function(element) {
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
            top: '200',
            left: 'auto'
        }).spin(element);
    };

    angular.module('citizens-initiative', ['citizens-initiative-graph', 'ui.bootstrap.dialog'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', '$location', 'Graph', function($scope, $location, Graph) {
                        spinner(document.getElementById('chart_div'));
                        Graph.setLocationSetter(function(path) {
                            $location.path(path);
                            $scope.$apply();
                        });
                        $scope.graph = Graph;
                    }],
                    template: document.getElementById('initiatives-all.html').innerHTML
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.header = {
                                fi: 'Kannatetuimmat käynnissäolevat aloitteet'
                            };
                            $scope.initiatives =
                                _(
                                    _(data)
                                        .map(fillInitiative)
                                        .filter(function(initiative) {
                                            return new Date(initiative.endDate) > Date.now();
                                        })
                                ).sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                });
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                })
                .when('/lista/paattyneet/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.header = {
                                fi: 'Kannatetuimmat päättyneet aloitteet'
                            };
                            $scope.initiatives =
                                _(
                                    _(data)
                                        .map(fillInitiative)
                                        .filter(function(initiative) {
                                            return new Date(initiative.endDate) <= Date.now();
                                        })
                                ).sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                });
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                })
                .when('/:id/:pretty', {
                    controller: ['$routeParams', '$scope', 'Data', 'Graph',
                        function($routeParams, $scope, Data, Graph) {
                        var id = 'https://www.kansalaisaloite.fi/api/v1/initiatives/' + $routeParams.id;
                        window._gaq.push(['_trackEvent', 'Initiatives', 'Open', id]);
                        $scope.initiative = {};
                        Data.withData(function(data) {
                            $scope.initiative = fillInitiative(data[id], id);
                        });
                        $scope.graph = Graph;
                    }],
                    template: document.getElementById('initiatives-one.html').innerHTML
                });
            $locationProvider.html5Mode(true);
        }])
        .directive('initiativesNav', function() {
            return {
                restrict: 'A',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.links = [
                        {href: '/', name: 'Graafi'},
                        {href: '/lista/kannatetuimmat/50', name: 'Lista'},
                        {href: '/lista/paattyneet/50', name: 'Päättyneet'}
                    ];
                    $scope.location = $location;
                }],
                template: document.getElementById('initiatives-nav.html').innerHTML
            };
        });

    angular.module('citizens-initiative-data', ['ngResource'])
        .factory('Data', ['$resource', '$filter', function($resource, $filter) {
            var Resource = $resource('/initiatives-sorted-streaked.json');
            var Data = null;

            var listeners = {
                listeners: [],
                push: function(listener) {
                    this.listeners.push(listener);
                    return this.check();
                },
                check: function() {
                    if (!(Data instanceof Resource)) {
                        return this;
                    }

                    var listener;
                    while ((listener = this.listeners.pop()) !== undefined) {
                        listener(Data);
                    }

                    return this;
                }
            };

            Resource.get({}, function(data) {
                Data = data;
                listeners.check();
            });

            return {
                withData: function(listener) {
                    listeners.push(listener);
                },
                googleDataArray: function() {
                    if (!(Data instanceof Resource)) {
                        return null;
                    }
                    var idPos;
                    var data = _.map(Data, fillInitiative);

                    var chartData = [];
                    data.sort(function(b, a) {
                        return a.currentTotal - b.currentTotal;
                    });
                    idPos = _.reduce(data, function(idPos, initiative) {
                        return idPos.concat([initiative.id, null]);
                    }, []);
                    idPos.unshift('Time');
                    var names = _.map(data, function(initiative) {
                        return initiative.name.fi;
                    });
                    names.unshift('Time');
                    chartData.push([]);
                    var timeCount = {}, i, time, index;
                    angular.forEach(data, function(initiative) {
                        index = idPos.indexOf(initiative.id);
                        angular.forEach(initiative.support, function(count) {
                            time = count[0];
                            count = count[1];

                            if (!time || !count) {
                                return;
                            }

                            if (!timeCount.hasOwnProperty(time)) {
                                timeCount[time] = new Array(idPos.length);
                                timeCount[time][0] = time;
                                for (i = 1; i < idPos.length; i += 1) {
                                    timeCount[time][i] = null;
                                }
                            }
                            timeCount[time][index] = count;
                            timeCount[time][index+1] =
                                '<div class="initiative-tooltip"><p>' +
                                    '<span class="count">' + count + '</span>' +
                                    '<span class="date">' + $filter('date')(time, "dd.MM.yyyy HH:mm:ss") + '</span>' +
                                '</p><p class="name">' + initiative.name.fi + '</p></div>';
                        });
                    });
                    chartData = _.values(timeCount);
                    chartData.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    chartData[0] = names;

                    return {chart: chartData, idPos: idPos};
                }
            };
        }]);

    angular.module('citizens-initiative-graph', ['citizens-initiative-data'])
        .directive('initiativeChartSingle', function() {
            return {
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: {
                    initiative: '=initiative'
                },
                controller: ['$scope', 'Graph', function($scope, Graph) {
                    $scope.$watch('initiative', function(initiative) {
                        if (!initiative.id) {
                            return;
                        }
                        Graph.drawSingle('initiative-chart-fulltime', initiative);
                    });
                }],
                template: '<div ng-transclude></div>'
            };
        })
        .factory('Graph', ['Data', '$filter', function(Data, $filter) {
            var wrapper = null;
            var locationSetter = null;
            return {
                setLocationSetter: function(setter) {
                    locationSetter = setter;
                },
                drawSingle: function(containerId, initiative) {
                    if (!document.getElementById(containerId)) {
                        return;
                    }

                    var startDate = new Date(initiative.startDate);

                    var data = new google.visualization.DataTable();
                    data.addColumn('datetime', 'Time');
                    data.addColumn('number', initiative.name.fi);
                    data.addColumn({type:'boolean',role:'certainty'});
                    data.addColumn({type:'string',role:'tooltip',p:{html:true}});

                    var rows = [];
                    angular.forEach(initiative.support, function(value) {
                        if (!value.hasOwnProperty('length') || value.length !== 2) {
                            return;
                        }
                        var val = value.slice(0);
                        val.push(true);
                        val.push(
                            '<div class="initiative-tooltip"><p>' +
                                '<span class="count">' + value[1] + '</span>' +
                                '<span class="date">' + $filter('date')(value[0], "dd.MM.yyyy HH:mm:ss") + '</span>' +
                            '</p></div>'
                        );
                        rows.push(val);
                    });

                    if (rows.length < 1) {
                        return;
                    }

                    rows.unshift([
                        startDate,
                        0,
                        false,
                        '<div class="initiative-tooltip"><p>' +
                            '<span class="count">0</span>' +
                            '<span class="date">' + $filter('date')(startDate, "dd.MM.yyyy HH:mm:ss") + '</span>' +
                        '</p></div>'
                    ]);

                    data.addRows(rows);

                    var chart = new google.visualization.ChartWrapper({
                        chartType: 'LineChart',
                        containerId: containerId,
                        dataTable: data
                    });
                    chart.setOptions({
                        'backgroundColor': 'whiteSmoke',
                        'hAxis': {
                            'format': 'MM.yyyy',
                            'minValue': new Date(initiative.startDate),
                            'maxValue': new Date(initiative.endDate),
                            'viewWindow': {
                                'min': new Date(initiative.startDate),
                                'max': new Date(initiative.endDate)
                            }
                        },
                        'vAxis': {
                            'minValue': 0,
                            'maxValue': Math.max(50000, initiative.currentTotal+10000),
                            'viewWindow': {
                                'min': 0,
                                'max': Math.max(50000, initiative.currentTotal+10000)
                            },
                            'gridlines': {
                                'count': 6
                            }
                        },
                        'legend': {
                            'position': 'none'
                        },
                        'chartArea': {
                            'top': 20,
                            'left': 60,
                            'width': '80%',
                            'height': '80%'
                        },
                        'tooltip': {
                            'isHtml': true
                        }
                    });

                    chart.draw();
                },
                draw: function(containerId) {
                    var data;
                    if (document.getElementById(containerId).childElementCount > 1) {
                        return;
                    }
                    data = Data.googleDataArray();
                    if (!data) {
                        return;
                    }

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
                            'left': 60
                        },
                        'hAxis': {
                            'format': 'dd.MM.yyyy' // dd.MM.yyyy HH:mm
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
                            locationSetter('/' + id.match(/\d+$/)[0] + '/' + prettyUrlText(data[id].name.fi));
                        });
                    });

                    wrapper.draw();
                }
            };
        }]);
}());
