(function () {
    "use strict";

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({
            pkg:grunt.file.readJSON('package.json'),
            concat: {
                options: {
                    separator: ';'
                },
                dist: {
                    src: [
                        'web/assets/bootstrap/js/bootstrap.js',
                        'components/spin.js/spin.js',
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
                        document: true
                    }
                }
            },
            watch: {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'qunit']
            },
            connect: {
                server: {
                    options: {
                        port: 8000,
                        base: '.'
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

        grunt.registerTask('test', ['jshint', 'qunit']);

        grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
    };
}());
