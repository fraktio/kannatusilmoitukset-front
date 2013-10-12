(function () {
    "use strict";

    var _ = require('underscore');

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
            pkg:grunt.file.readJSON('package.json'),
            jshint: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                options: {
                    bitwise: true,
                    camelcase: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    immed: true,
                    indent: 4,
                    latedef: true,
                    newcap: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    plusplus: true,
                    // quotmark: true,
                    undef: true,
                    unused: true,
                    strict: true,
                    trailing: true,
                    maxparams: 4,
                    maxdepth: 4,
                    maxstatements: 17, // todo
                    maxcomplexity: 10,
                    maxlen: 120,

                    browser: true,

                    globals: {
                        _: false,
                        jQuery: false,
                        angular: false,
                        google: false,
                        Spinner: false,
                        module: false
                    }
                }
            },
            concat: {
                options: {
                    separator: ';'
                },
                clear: {
                    src: 'src/**/*.js',
                    dest: 'temp/kannatusilmoitukset.js'
                },
                uglified: {
                    src: [
                        'bower_components/yepnope/yepnope.js',
                        'bower_components/underscore/underscore-min.js',
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-route/angular-route.min.js',
                        'bower_components/angular-resource/angular-resource.min.js',
                        'bower_components/spin.js/dist/spin.min.js',
                        'temp/**/*.js'
                    ],
                    dest: 'temp/kannatusilmoitukset.min.js'
                }
            },
            copy: {
                dev: {
                    files: [
                        {
                            expand: true,
                            cwd: 'temp/',
                            src: '*.{js,html,css}',
                            dest: 'web/'
                        }
                    ]
                }
            },

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                dist: {
                    files: {
                        'temp/kannatusilmoitukset.min.js': ['<%= concat.clear.dest %>']
                    }
                }
            },

            template: {
                default: {
                    src: 'src/index.hb',
                    dest: 'temp/index.html',
                    variables: {
                        scripts: grunt.file.expand('src/**/*.js').map(function(name) {
                            return _.last(name.split('/'));
                        })
                    }
                }
            },

            less: {
                default: {
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.less',
                    dest: 'temp/',
                    ext: '.css'
                }
            },

            hashres: {
                options: {
                    encoding: 'utf8',
                    fileNameFormat: '${name}.${hash}.${ext}',
                    renameFiles: true
                },
                dist: {
                    src: [
                        'temp/**/*.{js,css}'
                    ],
                    dest: [
                        'temp/index.html'
                    ]
                }
            },

            watch: {
                files: ['Gruntfile.js', 'src/**'],
                tasks: ['build-dev']
            }
        });

        [
            'grunt-contrib-uglify',
            'grunt-contrib-jshint',
            'grunt-contrib-qunit',
            'grunt-contrib-watch',
            'grunt-contrib-concat',
            'grunt-contrib-connect',
            'grunt-contrib-copy',
            'grunt-contrib-less',
            'grunt-hashres',
            'grunt-templater'
        ].forEach(grunt.loadNpmTasks);

        grunt.registerTask('build-dev', ['concat:clear', 'uglify', 'concat:uglified', 'template', 'less', 'hashres', 'copy']);

        grunt.registerTask('build-prod', ['jshint', 'concat:clear', 'uglify', 'concat:uglified', 'template', 'less', 'hashres', 'copy']);

        grunt.registerTask('test', ['jshint', 'qunit']);

        grunt.registerTask('default', ['build-dev']);
    };
}());
