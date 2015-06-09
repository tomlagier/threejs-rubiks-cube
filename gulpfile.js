/* jshint node:true */
'use strict';

////// PACKAGES //////
// Gulp plugins
var gulp = require('gulp'),
    //gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    postCSS = require('gulp-postcss'),
    nano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    _ = require('lodash'),
    runSequence = require('run-sequence'),
    changed = require('gulp-changed'),
    del = require('del'),
    //rename = require('gulp-rename'),
    filter = require('gulp-filter'),
    debug = require('gulp-debug'),
    concat = require('gulp-concat'),
    path = require('path');

// PostCSS transforms
// Only use the ones you'll actually use!
var colorFunction = require('postcss-color-function'),
    colorGray = require('postcss-color-gray'),
    colorHexAlpha = require('postcss-color-hex-alpha'),
    customMedia = require('postcss-custom-media'),
    customSelectors = require('postcss-custom-selectors'),
    mediaMinMax = require('postcss-media-minmax'),
    selectorNot = require('postcss-selector-not'),
    imageSet = require('postcss-image-set'),
    vmin = require('postcss-vmin'),
    willChange = require('postcss-will-change'),
    colorAlpha = require('postcss-color-alpha'),
    colorHcl = require('postcss-color-hcl'),
    pcssEach = require('postcss-each'),
    pcssFor = require('postcss-for'),
    pcssCond = require('postcss-conditionals'),
    mixins = require('postcss-mixins'),
    grid = require('postcss-grid'),
    simpleVariables = require('postcss-simple-vars'),
    quantityQueries = require('postcss-quantity-queries'),
    simpleExtend = require('postcss-simple-extend'),
    verticalRhythm = require('postcss-vertical-rhythm'),
    at2x = require('postcss-at2x'),
    pcssImport = require('postcss-import'),
    sprites = require('postcss-sprites'),
    pcssUrl = require('postcss-url'),
    easings = require('postcss-easings'),
    generatePreset = require('postcss-generate-preset'),
    classPrefix = require('postcss-class-prefix'),
    nested = require('postcss-nested'),
    pixrem = require('pixrem'),
    mqpacker = require('css-mqpacker'),
    csswring = require('csswring'),
    cssgrace = require('cssgrace'),
    doiuse = require('doiuse'),
    autoprefixer = require('autoprefixer-core');

//Webpack and loaders
var webpack = require('gulp-webpack');

//JS
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

////// CONFIG //////
var config = require('./config.json');
config = JSON.parse(_.template(JSON.stringify(config))(config));

var isDev = false;
gulp.task('setdev', function () {
  isDev = true;
});

////// RESET //////
gulp.task('clean', function(callback) {
  del([config.build], callback);
});

////// STATIC //////
gulp.task('copy', function(){
  var source = isDev ? config.source.dev : config.source.prod;

  return gulp.src(source, {
    cwd : config.src
  })
  .pipe(changed(config.build))
  .pipe(gulp.dest(config.build));
});

////// CSS //////
//Pass individual plugin options here. Remove plugin from default list and add to processor list if you need environment-specific config
config.css.transforms = [
  pcssImport ({
    path: [config.src + '/assets/css/src']
  }),
  mixins,
  simpleExtend, 
  pcssEach, 
  pcssFor, 
  pcssCond, 
  nested,
  customSelectors, 
  customMedia, 
  simpleVariables, 
  selectorNot, 
  colorFunction, 
  pcssUrl, 
  autoprefixer({ browsers: ['ie >= 9', '> 1%'] }),
  colorGray, 
  colorHexAlpha, 
  mediaMinMax, 
  imageSet, 
  vmin, 
  willChange, 
  colorAlpha, 
  colorHcl, 
  grid, 
  quantityQueries, 
  //verticalRhythm, 
  at2x, 
  sprites,
  easings, 
  pixrem, 
  //generatePreset, 
  //classPrefix, 
  cssgrace, 
];

gulp.task('css', [], function(){
  var dest = path.join(config.build, 'assets/css');

  //Environment specific processor config
  var processors = {
    dev : _.union(config.css.transforms, [
      //Can cause errors
      doiuse({
        browsers: ['ie >= 9', '> 1%'],
          onFeatureUsage: function(usageInfo) {
            console.log(usageInfo.message);
          }
      }),
    ]),
    prod : _.union(config.css.transforms, [
      mqpacker
    ])
  };

  var stripPartials = filter(['*', '!_*.css']);

  gulp.src(config.css.src)
    .pipe(stripPartials)
    .pipe(debug())
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(isDev, postCSS(processors.dev), postCSS(processors.prod)))
    .pipe(gulpif(!isDev, nano()))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('css-lib', [], function(){
  var dest = path.join(config.build, 'assets/css');

  gulp.src(config.css.lib)
    .pipe(debug())
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(dest));
});

////// JS //////
gulp.task('js', [], function(){
  var dest = path.join(config.build, 'assets/js');

  gulp.src(config.js.src)
    .pipe(debug())
    .pipe(babel())
    .pipe(gulp.dest(dest));
});

gulp.task('js-lib', [], function(){
  var dest = path.join(config.build, 'assets/js');

  gulp.src(config.js.lib)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(concat('vendor.js'))
    .pipe(gulpif(!isDev, uglify()))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

////// BUNDLING //////
_.extend(config.webpack, {
  loaders: [
    {
      test: /\.js$/,
      loader: 'imports!script'
    }
  ],
  output : {
    filename : 'app.js'
  }
});

gulp.task('webpack', [], function(){
  var dest = path.join(config.build, 'assets/js');

  gulp.src(config.js.dest)
    .pipe(webpack(config.webpack))
    .pipe(gulp.dest(dest));
});

////// BUILDING //////
gulp.task('build', function(callback){
  runSequence('clean', ['copy', 'css', 'css-lib', 'js', 'js-lib'], 'webpack', callback);
});

/////// WATCHING //////
gulp.task('watch', function(){
  gulp.watch(config.watch.app, ['webpack']);
  gulp.watch(config.watch.cssLib, ['css-lib']);
  gulp.watch(config.watch.jsLib, ['js-lib']);
  gulp.watch(config.watch.staticFiles, ['copy']);
});

////// START //////
gulp.task('dev', ['setdev', 'build', 'watch']);
gulp.task('default', ['build']);