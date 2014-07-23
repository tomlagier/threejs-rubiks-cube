module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: './src',
      include: './us',
      dest: './target'
    },
    clean: ['<%= dirs.dest %>'],
    sync: {
      us: {
        files: [{
          src: ['<%= dirs.include %>/**', '!<%= dirs.include %>/.git'],
          dest: '<%= dirs.dest %>'
        }]
      },
      dist: {
        files: [{
          cwd: '<%= dirs.src %>',
          src: ['**', '!assets/scss/**', '!assets/js/**'], // .coffee, whatever else
          dest: '<%= dirs.dest %>'
        }]
      },
      dev: { //copy all files for dev to target dir
        files: [{
          cwd: '<%= dirs.src %>',
          src: ['**'],
          dest: '<%= dirs.dest %>'
        }]
      }
    },
    compass: {
      dist: {
        options: {
          bundleExec: true,
          config: 'conf/config.rb',
          environment: 'production'
        }
      },
      dev: {
        options: {
          bundleExec: true,
          config: 'conf/config.rb',
          environment: 'development',
          outputStyle: 'expanded'
        }
      }
    },
    useminPrepare: {
      html: '<%= dirs.dest %>/index.html',
      options: {
        dest: 'target',
        root: '<%= dirs.src %>',
        flow: {
        	steps: {
        		js: ['concat', 'uglifyjs']
      		},
					post: {
					  js: [{
					    name: 'uglify',
					    createConfig: function (context, block) {
					      var generated = context.options.generated;
					      if (!generated.options) generated.options = {}
					      if (!generated.options.compress) generated.options.compress = {}
					      generated.options.compress.drop_console = true;
					    }
					  }]
					}
        }
      }
    },
    usemin: {
      html: '<%= dirs.dest %>/index.html',
    },
		removelogging: {
		  dist: {
		    src: "src/<%= pkg.name %>.js",
		    dest: "build/<%= pkg.name %>.clean.js",
		    options: {}
		  }
		},
    fileblocks: {
      dev: {
        src: '<%= dirs.dest %>/index.html',
        blocks: {
          scripts: {
            removeFiles: true,
            cwd: '<%= dirs.src %>',
            prefix: ''
          }
        }
      },
      dist: {
        src: '<%= dirs.dest %>/index.html',
        blocks: {
          scripts: {
            removeFiles: true,
            cwd: '<%= dirs.src %>',
            prefix: ''
          },
          reload: {
            removeBlock: true
          }
        }
      }

    },
    cdn: {
      options: {
        cdn: '<?=AWS_CF_HOST?>',
        supportedTypes: { 'php': 'html' }
      },
      dist: {
        src: ['<%= dirs.dest %>/**/*.php']
      }
    },
    jshint: {
      files: ['<%= dirs.src %>/assets/js/src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    scsslint: {
      dist: ['<%= dirs.src %>/assets/scss/**/*'],
      options: {
        bundleExec: true,
        config: './.scss-lint.yml',
        compact: true,
        colorizeOutput: true
      }
    },
    watch: {
      sync: {
        files: ['<%= dirs.src %>/**', '!**/*.scss'], // ! .coffee, or whatever else
        tasks: ['jshint', 'sync:dev','fileblocks:dev']
      },
      compass: {
        files: ['<%= dirs.src %>/assets/scss/**/*'],
        tasks: ['scsslint', 'compass:dev']
      },
      livereload: {
        options: { livereload : true },
        files: ['<%= dirs.src %>/**/*']
      }
    }

  });

  // load all tasks declared in devDependencies
  Object.keys(require('./package.json').devDependencies).forEach(function (dep) {
    if (dep.substring(0, 6) === 'grunt-') {
      grunt.loadNpmTasks(dep);
    }
  });

  grunt.registerTask('dev', ['clean', 'jshint', 'scsslint', 'sync:us', 'sync:dev', 'compass:dev', 'fileblocks:dev']);

  grunt.registerTask('default', ['clean', 'jshint', 'scsslint', 'sync:us', 'sync:dist', 'compass:dist', 'fileblocks:dist', 'useminPrepare', 'concat', 'uglify', 'usemin']);

};
