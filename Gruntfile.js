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
                dist: {
                    src: [
                        'web/assets/bootstrap/js/bootstrap.js',
                        'components/spin.js/spin.js',
                        'components/angular-bootstrap/src/transition/transition.js',
                        'components/angular-bootstrap/src/dialog/dialog.js',
                        'src/**/*.js'
                    ],
                    dest: 'web/assets/js/<%= pkg.name %>.js'
                }
            },
            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                dist: {
                    files: {
                        'web/assets/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'concat', 'uglify']
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

        grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy', 'hashres']);
    };
}());
