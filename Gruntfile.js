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
          src: ['**', '!assets/scss/**'], // .coffee, whatever else
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
          environment: 'development',
          outputStyle: 'expanded'
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
    watch: {
      sync: {
        files: ['<%= dirs.src %>/**', '!**/*.scss'], // ! .coffee, or whatever else
        tasks: ['sync:dev','fileblocks:dev']
      },
      compass: {
        files: ['<%= dirs.src %>/assets/scss/**/*'],
        tasks: ['compass:dev']
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

  grunt.registerTask('dev', ['clean', 'sync:us', 'sync:dev', 'compass:dev', 'fileblocks:dev', 'watch']);

  grunt.registerTask('default', ['clean', 'sync:us', 'sync:dist', 'compass:dist', 'fileblocks:dist']);

};
