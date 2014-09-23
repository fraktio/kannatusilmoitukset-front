/* global module, require */
(function () {
    "use strict";

    module.exports = function (grunt) {
        require('jit-grunt')(grunt);

        // Project configuration.
        grunt.initConfig({
            pkg:grunt.file.readJSON('package.json'),
            jshint: {
                files: ['*.js', '*.json', 'src/**/*.js'],
                options: {jshintrc: 'jshint.json'}
            },
            clean: {
                'default': ['temp']
            },
            concat: {
                options: {
                    separator: ';\n'
                },
                uglified: {
                    src: [
                        'bower_components/yepnope/yepnope*min.js',
                        'bower_components/underscore/underscore-min.js',
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-route/angular-route.min.js',
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
                        'temp/kannatusilmoitukset.min.js': [
                            'bower_components/spin.js/spin.js',
                            'src/**/*.js'
                        ]
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

            cssmin: {
                'default': {
                    expand: true,
                    cwd: 'temp/',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'temp/',
                    ext: '.min.css'
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
                tasks: ['build']
            }
        });

        grunt.registerTask(
            'build',
            [
                'clean',
                'jshint',
                'uglify',
                'concat:uglified',
                'less',
                'cssmin',
                'copy:temp',
                'hashres',
                'copy:web'
            ]
        );

        grunt.registerTask('default', ['build']);
    };
}());
