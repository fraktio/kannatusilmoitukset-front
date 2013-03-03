(function () {
    "use strict";

    angular.module("ngLocale", [], ["$provide", function($provide) {
        var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
        $provide.value("$locale", {"NUMBER_FORMATS":{"DECIMAL_SEP":",","GROUP_SEP":" ","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"","posSuf":" \u00A4","negPre":"-","negSuf":" \u00A4","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"€"},"pluralCat":function (n) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;},"DATETIME_FORMATS":{"MONTH":["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],"SHORTMONTH":["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],"DAY":["sunnuntaina","maanantaina","tiistaina","keskiviikkona","torstaina","perjantaina","lauantaina"],"SHORTDAY":["su","ma","ti","ke","to","pe","la"],"AMPMS":["ap.","ip."],"medium":"d.M.yyyy H.mm.ss","short":"d.M.yyyy H.mm","fullDate":"cccc d. MMMM y","longDate":"d. MMMM y","mediumDate":"d.M.yyyy","shortDate":"d.M.yyyy","mediumTime":"H.mm.ss","shortTime":"H.mm"},"id":"fi-fi"});
    }]);

    angular.module('citizens-initiative', ['citizens-initiative-graph', 'ui.bootstrap.dialog'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/', {
                    controller: ['$scope', '$location', '$routeParams', 'Graph', function($scope, $location, $routeParams, Graph) {
                        Graph.setLocationSetter(function(path) {
                            $location.path(path);
                            $scope.$apply();
                        });
                        $scope.graph = Graph;
                    }],
                    template: document.getElementById('initiatives-all.html').innerHTML
                })
                .when('/:id/:pretty', {
                    controller: ['$scope', '$location', '$routeParams', 'Data', 'Graph', '$dialog', function($scope, $location, $routeParams, Data, Graph, $dialog) {
                        $scope.id = 'https://www.kansalaisaloite.fi/api/v1/initiatives/' + $routeParams.id;
                        var d = $dialog.dialog({
                            modalFade: true,
                            template: document.getElementById('initiatives-one.html').innerHTML,
                            resolve: {
                                id: $scope.id
                            },
                            controller: ['$scope', 'dialog', 'id', function($scope, dialog, id){
                                _gaq.push(['_trackEvent', 'Initiatives', 'Open', id]);
                                $scope.id = id;
                                $scope.data = Data.data;

                                $scope.initiative = {name: {'fi':''}, currentTotal:0, totalSupportCount:[]};

                                $scope.$watch('data', function(data) {
                                    if (!data || !data[$scope.id]) {
                                        return;
                                    }

                                    var initiative = data[$scope.id];
                                    if (!initiative.hasOwnProperty('support')) {
                                        initiative.id = $scope.id;
                                        initiative.support = initiativeSupportArray(initiative);
                                        initiative.url = idToUrl(initiative.id);
                                    }

                                    $scope.initiative = initiative;
                                }, true);

                                $scope.close = function() {
                                    dialog.close();
                                };
                                $scope.graph = Graph;
                            }]
                        });
                        d.open().then(function() {
                            $location.path('/');
                        });
                        setTimeout(function() {
                            $('.spinner').remove();
                        }, 0);
                    }],
                    template: ' '
                });
            $locationProvider.html5Mode(true);
        }]);

    angular.module('citizens-initiative-data', ['ngResource'])
        .factory('Data', ['$resource', function($resource) {
            var Data = $resource('/initiatives-sorted-streaked.json').get();
            var cache = null;

            return {
                data: Data,
                googleDataArray: function() {
                    if (cache) {
                        return cache;
                    }
                    var data = $.map(Data, function(initiative, id) {
                        if (typeof(initiative) !== "object") {
                            return null;
                        }

                        initiative.id = id;

                        return initiative;
                    });

                    if (data.length < 1) {
                        return [];
                    }

                    var chartData = [];
                    data = $.map(data, function(initiative) {
                        if (!initiative.hasOwnProperty('support')) {
                            initiative.support = initiativeSupportArray(initiative);
                            initiative.url = idToUrl(initiative.id);
                        }
                        return initiative;
                    });
                    data.sort(function(b, a) {
                        return a.currentTotal - b.currentTotal;
                    });
                    window.idPos = $.map(data, function(initiative, i) {
                        return [initiative.id, null];
                    });
                    idPos.unshift('Time');
                    var names = $.map(data, function(initiative) {
                        return initiative.name.fi;
                    });
                    names.unshift('Time');
                    chartData.push([]);
                    var timeCount = {};
                    var i;
                    var url;
                    $.each(data, function(i, initiative) {
                        $.each(initiative.support, function(i, count) {
                            var time = count[0];
                            count = count[1];

                            if (!time || !count) {
                                return;
                            }

                            if (!timeCount.hasOwnProperty(time)) {
                                timeCount[time] = new Array(idPos.length);
                                timeCount[time][0] = time;
                                for (i = 1; i < idPos.length; i++) timeCount[time][i] = null;
                            }
                            timeCount[time][idPos.indexOf(initiative.id)] = count;
                            timeCount[time][idPos.indexOf(initiative.id)+1] = '<div class="initiative-tooltip"><p><span class="count">' + count + '</span><span class="date">' + dateFullFormatter.formatValue(time) + '</span></p><p class="name">' + initiative.name.fi + '</p></div>';
                        });
                    });
                    chartData = $.map(timeCount, function(counts, time) {
                        return [counts];
                    });
                    chartData.sort(function(a, b) {
                        return a[0] - b[0];
                    });
                    chartData[0] = names;

                    cache = chartData;

                    return chartData;
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
                controller: ['$scope', '$element', '$attrs', 'Graph', function($scope, $element, $attrs, Graph) {
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
        .factory('Graph', ['Data', function(Data) {
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
                        val.push('<div class="initiative-tooltip"><p><span class="count">' + value[1] + '</span><span class="date">' + dateFullFormatter.formatValue(value[0]) + '</span></p></div>');
                        rows.push(val);
                    });

                    if (rows.length < 1) {
                        return;
                    }

                    rows.unshift([new Date(initiative.startDate), 0, false, '<div class="initiative-tooltip"><p><span class="count">0</span><span class="date">' + dateFullFormatter.formatValue(new Date(initiative.startDate)) + '</span></p></div>']);

                    data.addRows(rows);

                    var chart = new google.visualization.ChartWrapper({
                        chartType: 'LineChart',
                        containerId: containerId,
                        dataTable: data
                    });
                    chart.setOptions({
                        'backgroundColor': 'white',
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
                            'maxValue': 50000,
                            'viewWindow': {
                                'min': 0,
                                'max': 50000
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
                            'width': 450,
                            'height': 260
                        },
                        width: 530,
                        height: 300,
                        'tooltip': {
                            'isHtml': true
                        }
                    });

                    chart.draw();
                },
                draw: function(containerId) {
                    if (!document.getElementById(containerId)) {
                        return;
                    }
                    if (document.getElementById(containerId).childElementCount > 1) {
                        return;
                    }
                    var arrayedData = Data.googleDataArray().slice(0);

                    if (arrayedData.length < 1) {
                        return;
                    }

                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('datetime', arrayedData[0][0]);
                    for (var i = 1; i < arrayedData[0].length; i++) {
                        dataTable.addColumn('number', arrayedData[0][i]);
                        dataTable.addColumn({type:'string',role:'tooltip',p:{html:true}});
                    }

                    arrayedData[0] = null;

                    dataTable.addRows(arrayedData);
                    wrapper = new google.visualization.ChartWrapper({
                        chartType: 'LineChart',
                        containerId: containerId,
                        dataTable: dataTable
                    });
                    wrapper.setOptions({
                        'backgroundColor': 'whiteSmoke',
                        'chartArea': {
                            'top': 20,
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

                    var listener = google.visualization.events.addListener(wrapper, 'select', function(e) {
                        if (wrapper.getChart().getSelection().length < 1) {
                            return;
                        }
                        var id = idPos[wrapper.getChart().getSelection()[0].column];

                        wrapper.getChart().setSelection(null);

                        locationSetter('/' + id.match(/\d+$/)[0] + '/' + prettyUrlText(Data.data[id].name.fi));
                    });

                    wrapper.draw();
                }
            };
        }]);

    var prettyUrlText = function(text) {
        return text.split(' ').slice(0,5).join(' ')
                .toLowerCase()
                .replace(/[äå]/g, 'a')
                .replace(/ö/g, 'o')
                .replace(/[^a-z0-9]+/g, '-');
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

    var timeParser = function(time) {
        return function(start, length) {
            return parseInt(time.substr(start, length), 10);
        };
    };
    var idToUrl = function(id) {
        return 'https://www.kansalaisaloite.fi/fi/aloite/' + id.match(/\d+$/)[0];
    };

    google.load('visualization', '1', {packages:['corechart'], callback:function() {
        window.dateFullFormatter = new google.visualization.DateFormat({pattern: "dd.MM.yyyy HH:mm:ss"});
        angular.bootstrap(document, ['citizens-initiative']);
    }});

    new Spinner({lines: 9, length: 4, width: 5, radius: 13, corners: 1, rotate: 5, color: '#000', speed: 1, trail: 79, shadow: false, hwaccel: false, className: 'spinner', zIndex: 2e9, top: '200', left: 'auto'}).spin(document.getElementById('chart_div'));

    var _gaq = window._gaq || [];
    window._gaq = _gaq;
    _gaq.push(['_setAccount', 'UA-37909592-1']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.async = true;
        ga.src = '//www.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/fi_FI/all.js#xfbml=1";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}());
