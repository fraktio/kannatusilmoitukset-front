/* global module */
(function () {
    "use strict";

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
                    }
                }
            },
            clean: {
                'default': ['temp']
            },
            concat: {
                options: {
                    separator: ';'
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
                temp: {
                    files: [
                        {
                            expand: true,
                            cwd: 'src/',
                            src: '**/*.html',
                            dest: 'temp/'
                        }
                    ]
                },
                web: {
                    files: [
                        {
                            expand: true,
                            cwd: 'temp/',
                            src: '**/*',
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
                        'temp/kannatusilmoitukset.min.js': ['src/**/*.js']
                    }
                }
            },

            less: {
                'default': {
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
            'grunt-contrib-clean',
            'grunt-hashres'
        ].forEach(grunt.loadNpmTasks);

        grunt.registerTask(
            'build',
            ['clean', 'jshint', 'uglify', 'concat:uglified', 'less', 'copy:temp', 'hashres', 'copy:web']
        );

        grunt.registerTask('default', ['build']);
    };
}());
