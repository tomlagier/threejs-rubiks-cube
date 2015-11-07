/* jshint node:true */
'use strict';

////// PACKAGES //////
// Gulp plugins
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  postCSS = require('gulp-postcss'),
  //nano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  _ = require('lodash'),
  runSequence = require('run-sequence'),
  changed = require('gulp-changed'),
  del = require('del'),
  //rename = require('gulp-rename'),
  filter = require('gulp-filter'),
  debug = require('gulp-debug'),
  concat = require('gulp-concat'),
  path = require('path'),
  sass = require('gulp-sass'),
  zip = require('gulp-zip');

// PostCSS transforms
// Only use the ones you'll actually use!
var //colorFunction = require('postcss-color-function'),
  //colorGray = require('postcss-color-gray'),
  //colorHexAlpha = require('postcss-color-hex-alpha'),
  //customMedia = require('postcss-custom-media'),
  //customSelectors = require('postcss-custom-selectors'),
  //mediaMinMax = require('postcss-media-minmax'),
  //selectorNot = require('postcss-selector-not'),
  //imageSet = require('postcss-image-set'),
  //vmin = require('postcss-vmin'),
  //willChange = require('postcss-will-change'),
  //colorAlpha = require('postcss-color-alpha'),
  //colorHcl = require('postcss-color-hcl'),
  //pcssEach = require('postcss-each'),
  //pcssFor = require('postcss-for'),
  //pcssCond = require('postcss-conditionals'),
  //mixins = require('postcss-mixins'),
  //grid = require('postcss-grid'),
  //simpleVariables = require('postcss-simple-vars'),
  //quantityQueries = require('postcss-quantity-queries'),
  //simpleExtend = require('postcss-simple-extend'),
  //verticalRhythm = require('postcss-vertical-rhythm'),
  //at2x = require('postcss-at2x'),
  //pcssImport = require('postcss-import'),
  //sprites = require('postcss-sprites'),
  //pcssUrl = require('postcss-url'),
  easings = require('postcss-easings'),
  //generatePreset = require('postcss-generate-preset'),
  //classPrefix = require('postcss-class-prefix'),
  //nested = require('postcss-nested'),
  pixrem = require('pixrem'),
  mqpacker = require('css-mqpacker'),
  //csswring = require('csswring'),
  //cssgrace = require('cssgrace'),
  //doiuse = require('doiuse'),
  autoprefixer = require('autoprefixer-core');

//Webpack and loaders
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

//JS
var uglify = require('gulp-uglify');
//var babel = require('gulp-babel');

////// CONFIG //////
var config = require('./config.json');
config = JSON.parse(_.template(JSON.stringify(config))(config));

var isDev = false;
gulp.task('setdev', function () {
  isDev = true;
});

////// RESET //////
gulp.task('clean', function (callback) {
  del([config.build], callback);
});

////// STATIC //////
gulp.task('copy', function () {
  var source = isDev ? config.source.dev : config.source.prod;

  return gulp.src(source, {
      cwd: config.src
    })
    .pipe(changed(config.build))
    .pipe(gulp.dest(config.build));
});

////// CSS //////
//Pass individual plugin options here. Remove plugin from default list and add to processor list if you need environment-specific config
config.css.transforms = [
  autoprefixer({
    browsers: ['ie > 9', '> 1%']
  }),
  easings,
  pixrem
];

gulp.task('css', [], function () {
  var dest = path.join(config.build, 'assets/css');

  //Environment specific processor config
  var processors = {
    dev: _.union(config.css.transforms, [
    ]),
    prod: _.union(config.css.transforms, [
      mqpacker
    ])
  };

  var stripPartials = filter(['*', '!_*.css']);

  gulp.src(config.css.src)
    .pipe(stripPartials)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: !isDev ? 'compressed' : 'expanded',
      onError: function (err) {
        gutil.error('[error!]', err.message);
      }
    }))
    .pipe(gulpif(isDev, postCSS(processors.dev).on('error', function (error) {
      gutil.error('[error!]', error.message);
    }), postCSS(processors.prod).on('error', function (error) {
      gutil.error('[error!]', error.message);
    })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('css-lib', [], function () {
  var dest = path.join(config.build, 'assets/css');

  gulp.src(config.css.lib)
    .pipe(concat('libs.css').on('error', function (error) {
      gutil.error('[error!]', error.message);
    }))
    .pipe(gulp.dest(dest));
});

////// JS //////
// gulp.task('js', [], function () {
//   var dest = path.join(config.build, 'assets/js');

//   gulp.src(config.js.src)
//     .pipe(debug())
//     .pipe(babel().on('error', function(error){
//       gutil.error('[error!]', error.message);
//     }))
//     .pipe(gulp.dest(dest));
// });

gulp.task('js-lib', [], function () {
  var dest = path.join(config.build, 'assets/js');

  gulp.src(config.js.lib)
    .pipe(concat('vendor.js'))
    .pipe(gulpif(!isDev, uglify()))
    .pipe(gulp.dest(dest));
});

////// BUNDLING //////
_.extend(config.webpack, {
  module: {
    loaders: [{
      test: /\.(js|jsx|es6)$/,
      loader: 'babel',
      exclude: /node_modules/
      // query: {
      //   stage: 2
      // }
    }]
  },
  entry: {
    app: config.js.src
  },
  output: {
    path: path.resolve(config.build, 'assets/js'),
    filename: 'app.js'
  },
  devtool: '#inline-source-map'
});

gulp.task('webpack', [], function (callback) {
  webpack(config.webpack, function(err, stats){
    if(err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', ['build'], function () {
  //Start a webpack-dev-server
  var serverName = require('./package.json').local.serverAddress;

  if(isDev) {
    config.webpack.entry.app.unshift('webpack-dev-server/client?http://' + serverName + ':8080', 'webpack/hot/dev-server');
    config.webpack.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  }

  var compiler = webpack(config.webpack);
  var serverOpts = {
    contentBase: config.build,
    publicPath: '/assets/js/',
    filename: 'app.js',
    stats: {
      colors: true
    },
    debug: true
  };

  if (isDev) {
    _.extend(serverOpts, {
      hot: true,
      inline: true
    });
  }

  new WebpackDevServer(compiler, serverOpts).listen(8080, serverName, function (err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    // Server listening
    gutil.log('[webpack-dev-server]', serverName + ':8080');
  });
});

gulp.task('zip', function(){
  return gulp.src(config.build + '/**')
      .pipe(zip('build.zip'))
      .pipe(gulp.dest(config.deploy));
});

////// BUILDING //////
gulp.task('build', function (callback) {
  runSequence('clean', ['copy', 'css', 'css-lib', 'js-lib'], callback);
});

/////// WATCHING //////
gulp.task('watch', ['webpack-dev-server'], function () {
  gulp.watch(config.watch.scss, ['scss']);
  gulp.watch(config.watch.cssLib, ['css-lib']);
  gulp.watch(config.watch.jsLib, ['js-lib']);
  gulp.watch(config.watch.staticFiles, ['copy']);
});

////// START //////
gulp.task('dev', ['setdev', 'build', 'watch']);
gulp.task('default', ['build', 'webpack']);
//gulp.task('deploy', ['build', 'webpack', 'zip', 'eb']);
