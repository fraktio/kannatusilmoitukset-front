(function () {
    "use strict";

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
            pkg:grunt.file.readJSON('package.json'),
            copy: {
                dev: {
                    files: [
                        {
                            src: 'src/assets/index.html',
                            dest: 'web/index.html'
                        },
                        {
                            src: 'src/assets/css/citizens-initiative.css',
                            dest: 'web/assets/css/citizens-initiative.css'
                        }
                    ]
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
                        'web/assets/js/<%= pkg.name %>.min.js',
                        'web/assets/js/load.min.js',
                        'web/assets/css/citizens-initiative.css'
                    ],
                    dest: [
                        'web/index.html'
                    ]
                }
            },
            concat: {
                options: {
                    separator: ';'
                },
                clear: {
                    src: [
                        'components/angular-bootstrap/src/transition/transition.js',
                        'components/angular-bootstrap/src/dialog/dialog.js',
                        'src/<%= pkg.name %>.js'
                    ],
                    dest: 'web/assets/js/<%= pkg.name %>.js'
                },
                uglified: {
                    src: [
                        'components/underscore/underscore-min.js',
                        'components/angular/angular.min.js',
                        'components/angular-resource/angular-resource.min.js',
                        'components/spin.js/dist/spin.min.js',
                        'web/assets/js/<%= pkg.name %>.min.js'
                    ],
                    dest: 'web/assets/js/<%= pkg.name %>.min.js'
                }
            },
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                dist: {
                    files: {
                        'web/assets/js/load.min.js': [
                            'components/yepnope/yepnope.js',
                            'src/load.js'
                        ],
                        'web/assets/js/<%= pkg.name %>.min.js': ['<%= concat.clear.dest %>']
                    }
                }
            },
            qunit: {
                files: ['test/**/*.html']
            },
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
                    maxstatements: 20, // todo
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
            watch: {
                files: ['<%= jshint.files %>', 'src/assets/**'],
                tasks: ['jshint', 'concat:clear', 'uglify', 'concat:uglified', 'copy', 'hashres']
            },
            connect: {
                server: {
                    options: {
                        port: 8000,
                        base: 'web'
                    }
                }
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
            'grunt-hashres'
        ].forEach(grunt.loadNpmTasks);

        grunt.registerTask('build-dev', ['jshint', 'concat:clear', 'uglify', 'concat:uglified', 'copy', 'hashres']);

        grunt.registerTask('build-prod', ['jshint', 'concat:clear', 'uglify', 'concat:uglified', 'copy', 'hashres']);

        grunt.registerTask('test', ['jshint', 'qunit']);

        grunt.registerTask('default', ['build-dev']);
    };
}());
