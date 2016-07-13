
module.exports = function (grunt) {
    'use strict';
    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            srcPath: 'src/',
            distPath: 'dist/',
            pubPath: 'public/'
        },

        banner: '<% pkg.name %>\n'+
        '<% pkg.description %>',

        sass: {
            dist:{
                files:{
                    "dist/main.css": "src/main.scss"
                },
                options:{
                    style:'expanded'
                }
            }
        },
        clean: {
            src:['<%= meta.distPath %>/']
        },
        copy: {
            img: {
                expand:true,
                src: 'src/img/*',
                dest: '<%= meta.distPath %>img/'//out 目录
            }
        },
        watch: {
            options: {
                livereload: true
            },
            src: {
                files: ['<%= meta.srcPath %>sass/*.scss'],
                tasks: ['sass']
            },
            html:{
                files: ['<%= meta.srcPath %>/*.html'],
                tasks: []
            },
            /*js: {
                files: ['<%= meta.srcPath %>js/!*.js'],
                tasks: ['requirejs']
            }*/
        },

        requirejs: {
            a1406v: {
                options: {
                    baseUrl: "./src",
                    name: 'lib/almond',
                    include: ['main'],
                    out: '<%= meta.distPath %>main.js'
                }
            }
        },

        jshint: {
            options: {
                // jshintrc: 'js/.jshintrc'
                'eqeqeq': false,
                '-W033': true,
                '-W014': true,
                '-W030': true,
                '-W032': true,
                '-W069': true,
                '-W061': true,
                '-W103': true,//__proto__
            },

            src: {
                src: ['js/**/*.js', '*.js']
            }

        },

        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '',
                    livereload: true,
                    middleware: function (connect, options, middlewares) {
                        var fs = require('fs');
                        var path = require('path');
                        var support = ['POST', 'PUT', 'DELETE'];
                        middlewares.unshift(function (req, res, next) {
                            // 单独处理POST请求 请求的地址必须是文件 这里没有进行rewrite处理
                            if (support.indexOf(req.method.toUpperCase()) != -1) {
                                var filepath = path.join(options.base[0], req.url);
                                console.log(filepath);
                                if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                                    return res.end(fs.readFileSync(filepath));
                                }
                            }

                            return next();
                        });

                        return middlewares;
                    }
                }
            }
        },
        open: {
            kitchen: {
                path: 'http://localhost:3000/src/index.html'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    '<%= meta.pubPath %>main.min.css': ['<%= meta.distPath %>main.css']
                }
            }
        },
        uglify: {
            target: {
                files: {
                    '<%= meta.pubPath %>main.min.js': ['<%= meta.distPath %>main.js']
                }
            }
        }
    });

    // Load the plugins
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);


    // 核心
    grunt.registerTask('default', ['clean','requirejs', 'sass', 'copy','cssmin','uglify']);

    // server
    grunt.registerTask('default', 'Run server', [
        'connect',
        'open',
        'watch'
    ]);
};
