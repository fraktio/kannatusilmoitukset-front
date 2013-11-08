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
    var fastestTwoWeek = function (initiatives) {
        return _.max(_(initiatives).map(function(initiative) {
            return initiative.twoWeekSupport;
        }));
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

    angular.module('citizens-initiative', ['citizens-initiative-graph', 'ngRoute'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', 'Data', function($scope, Data) {
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.num = 100;
                            $scope.header = {
                                fi: 'Viimeisten kahden viikon aikana kannatetuimmat aloitteet'
                            };
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return initiative && new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.twoWeekSupport;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
                        });
                    }],
                    template: document.getElementById('list.html').innerHTML
                })
                .when('/graafi', {
                    controller: ['$scope', '$location', 'Graph', function($scope, $location, Graph) {
                        spinner(document.getElementById('chart_div'));
                        Graph.setLocationSetter(function(path) {
                            $location.path(path);
                        });
                        Graph.drawWithData('chart_div');
                    }],
                    template: document.getElementById('initiatives-all.html').innerHTML
                })
                .when('/lista/kannatetuimmat/:num', {
                    controller: ['$scope', '$routeParams', 'Data', function($scope, $routeParams, Data) {
                        $scope.num = $routeParams.num;
                        $scope.initiatives = [];
                        Data.withData(function(data) {
                            $scope.header = {
                                fi: 'Koko keräysaikanaan kannatetuimmat aloitteet'
                            };
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) > Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
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
                            $scope.initiatives = _.chain(data)
                                .filter(function(initiative) {
                                    return new Date(initiative.endDate) <= Date.now();
                                })
                                .sortBy(function(initiative) {
                                    return -initiative.currentTotal;
                                })
                                .value();
                            $scope.fastest = fastestTwoWeek($scope.initiatives);
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
                            $scope.initiative = _(data).find(function(initiative) { return initiative.id === id; });
                        });
                        $scope.graph = Graph;
                    }],
                    template: document.getElementById('initiatives-one.html').innerHTML
                })
                .when('/tilastot', {
                    controller: ['$scope', 'Data', function($scope, Data) {
                        /* global yepnope, jQuery, Morris */
                        Data.withData(function(initiatives) {
                            var drawStatistics = function() {
                                $scope.weekdayDonut = new Morris.Donut({
                                    element: jQuery('.statistics .weekday'),
                                    data: _(initiatives).reduce(function(data, initiative) {
                                        _(initiative.support).each(function(value, index, list) {
                                            if (index !== 0) {
                                                data[value[0].getDay()].value += value[1] - list[index-1][1];
                                            }
                                        });
                                        return data;
                                    }, [
                                        {label: 'Sunnuntai', value: 0},
                                        {label: 'Maanantai', value: 0},
                                        {label: 'Tiistai', value: 0},
                                        {label: 'Keskiviikko', value: 0},
                                        {label: 'Torstai', value: 0},
                                        {label: 'Perjantai', value: 0},
                                        {label: 'Lauantai', value: 0}
                                    ])
                                });
                                $scope.hourLine = new Morris.Line({
                                    element: jQuery('.statistics .hour'),
                                    data: _(initiatives).reduce(function(data, initiative) {
                                        _(initiative.support).each(function(value, index, list) {
                                            if (index !== 0) {
                                                data[value[0].getHours()].value += value[1] - list[index-1][1];
                                            }
                                        });
                                        return data;
                                    }, _.map(_.range(24), function(num) {
                                        return {label: '' + num, value: 0};
                                    })),
                                    xkey: 'label',
                                    ykeys: ['value'],
                                    labels: ['Kannatusilmoituksia'],
                                    hideHover: 'auto',
                                    parseTime: false,
                                    axes: false,
                                    grid: false
                                });
                            };
                            if (_([window.jQuery, window.Raphael, window.Morris]).some(_.isUndefined)) {
                                yepnope({
                                    load: [
                                        '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.css',
                                        '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
                                        '//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',
                                        '//cdnjs.cloudflare.com/ajax/libs/morris.js/0.4.2/morris.min.js'
                                    ],
                                    complete: drawStatistics
                                });
                            } else {
                                drawStatistics();
                            }
                        });
                    }],
                    template: document.getElementById('statistics.html').innerHTML
                });
            $locationProvider.html5Mode(true);
        }])
        .directive('initiativesNav', function() {
            return {
                restrict: 'A',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.links = [
                        {href: '/', name: 'Nousijat'},
                        {href: '/lista/kannatetuimmat/100', name: 'Kannatetuimmat'},
                        {href: '/lista/paattyneet/100', name: 'Päättyneet'},
                        {href: '/graafi', name: 'Graafi (6kk)'},
                        {href: '/tilastot', name: 'Tilastot'}
                    ];
                    $scope.location = $location;
                }],
                template: document.getElementById('initiatives-nav.html').innerHTML
            };
        });

    angular.module('citizens-initiative-data', ['ngResource'])
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
            var Graph = {
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
