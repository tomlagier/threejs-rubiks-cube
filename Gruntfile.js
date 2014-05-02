module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: './src',
      dest: './target'
    },
    clean: ['<%= dirs.dest %>'],
    sync: {
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
		      config: 'conf/config.rb',
          environment: 'production'
		    }
		  },
		  dev: {
		    options: {
		      config: 'conf/config.rb',
          environment: 'development'
		    }
		  }
		},
    useminPrepare: {
		  html: '<%= dirs.dest %>/views/scripts.php',
		  options: {
		    dest: 'target',
        root: '<%= dirs.src %>'
		  }
		},
    usemin: {
		  html: '<%= dirs.dest %>/views/scripts.php',
		},
    fileblocks: {
      dev: {
        src: '<%= dirs.dest %>/views/scripts.php',
        blocks: {
          scripts: {
            removeFiles: true,
            cwd: '<%= dirs.src %>',
            prefix: '/'
          }
        }
      },
      dist: {
        src: '<%= dirs.dest %>/views/scripts.php',
        blocks: {
          scripts: {
            removeFiles: true,
            cwd: '<%= dirs.src %>',
            prefix: '/'
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
    watch: {
      sync: {
        files: ['<%= dirs.src %>/**', '!**/*.scss'], // ! .coffee, or whatever else
        tasks: ['sync:dev']
      },
      compass: {
        files: ['<%= dirs.src %>/assets/scss/**'],
        tasks: ['compass:dist']
      },
      livereload: {
        options: { livereload : true },
        files: ['<%= dirs.dest %>/**/*']
      }
    }

  });

  // load all tasks declared in devDependencies
  Object.keys(require('./package.json').devDependencies).forEach(function (dep) {
		if (dep.substring(0, 6) === 'grunt-') {
			grunt.loadNpmTasks(dep);
		}
  });

  grunt.registerTask('dev', ['clean', 'sync:dev', 'compass:dev', 'fileblocks:dev']);

  grunt.registerTask('default', ['clean', 'jshint', 'sync:dist', 'compass:dist', 'fileblocks:dist', 'useminPrepare', 'concat', 'uglify', 'usemin', 'cdn']);

};
