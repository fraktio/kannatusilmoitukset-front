(function () {
    "use strict";

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
            pkg:grunt.file.readJSON('package.json'),
            copy: {
                dev: {
                    src: 'src/assets/index.htm',
                    dest: 'web/index.htm'
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
                        'web/assets/js/<%= pkg.name %>.min.js'
                    ],
                    dest: 'web/index.htm'
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
                        'src/**/*.js'
                    ],
                    dest: 'web/assets/js/<%= pkg.name %>.js'
                },
                uglified: {
                    src: [
                        'components/jquery/jquery.min.js',
                        'components/underscore/underscore.min.js',
                        'components/angular/angular.min.js',
                        'components/angular-resource/angular-resource.min.js',
                        'web/assets/bootstrap/js/bootstrap.min.js',
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
                        'web/assets/js/<%= pkg.name %>.min.js': ['<%= concat.clear.dest %>']
                    }
                }
            },
            qunit: {
                files: ['test/**/*.html']
            },
            jshint: {
                files: ['Gruntfile.js', 'src/**.js', 'test/**/*.js'],
                options: {
                    globals: {
                        jQuery: true,
                        console: true,
                        //module: true,
                        document: true,
                        angular: true
                    }
                }
            },
            watch: {
                files: ['<%= jshint.files %>', 'assets/**'],
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

        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-qunit');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-connect');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-hashres');

        grunt.registerTask('test', ['jshint', 'qunit']);

        grunt.registerTask('default', ['jshint', 'concat:clear', 'uglify', 'concat:uglified', 'copy', 'hashres']);
    };
}());
