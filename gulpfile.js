var _   			 	= require('lodash'),
		gulp 			 	= require('gulp'),
    filter      = require('gulp-filter'),
    changed     = require('gulp-changed'),
		conf 			 	= require('./gulpconf'),
		merge 		 	= require('merge-stream'),
		del      	  = require('del'),
		gutil      	= require('gulp-util'),
		gulpif     	= require('gulp-if'),
		sass 			 	= require('gulp-sass'),
		scsslint    = require('gulp-scss-lint'),
		spritesmith = require('gulp.spritesmith'),
		concat      = require('gulp-concat'),
		uglify      = require('gulp-uglify'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
		sourcemaps  = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    injectReload = require('gulp-inject-reload'),
		runSequence = require('run-sequence');

var scssSpriteDir = './.tmp-gulp-scss-sprites';

conf.file = './gulpfile.js';
conf = JSON.parse(gutil.template(JSON.stringify(conf), conf));
delete conf.file;

var isProd = true;
gulp.task('setdev', function () {
	isProd = false;
});

gulp.task('clean', function (cb) {
  del([conf.build, scssSpriteDir], cb);
});

gulp.task('copy:us', function () {
  return gulp.src('./us/**/*', {base: './'}).pipe(changed(conf.build)).pipe(gulpif(!isProd, gulp.dest(conf.build)));
});

gulp.task('copy', ['copy:us'], function () {
	var source = isProd ? conf.source.prod : conf.source.dev;
  var onlyHtml = filter(['*.html']);
	return gulp.src(source, {cwd: conf.src}).pipe(changed(conf.build)).pipe(onlyHtml).pipe(injectReload()).pipe(onlyHtml.restore()).pipe(gulp.dest(conf.build)).pipe(livereload());
});

gulp.task('sprites', function () {
	var spriteData = _.map(conf.sprites, function (source, name) {
		return gulp.src(source).pipe(spritesmith({
			imgName: 'assets/images/sprites/' + name + '.png',
			cssName: name + '.scss',
			cssTemplate: '.compass-sprite.mustache'
		}));
	});
	var streams = [];
	_.each(spriteData, function (stream) {
		var img = stream.img.pipe(gulp.dest(conf.build));
		var css = stream.css.pipe(gulp.dest(scssSpriteDir));
		streams.push(img, css);
	});

	return merge.apply(null, streams).pipe(livereload());
});

gulp.task('css', ['sprites'], function () {
	var streams = _.map(conf.css, function (sources, dest) {
		return gulp.src(sources)
			.pipe(scsslint())
		  .pipe(gulpif(!isProd, sourcemaps.init()))
		  .pipe(sass({
		  	outputStyle: isProd ? 'compressed' : 'expanded',
		  	includePaths: [require('node-bourbon').includePaths, scssSpriteDir]
		  }))
		  .pipe(gulpif(!isProd, sourcemaps.write()))
		  .pipe(gulp.dest(dest));
	});
	return merge.apply(null, streams).pipe(livereload());
});

gulp.task('scripts', function () {
	var streams = _.map(conf.js, function (dest, sources) {
		dest = dest.split('/');
		var filename = dest.pop();
		dest = dest.join('/');
		return gulp.src(sources)
		  .pipe(gulpif(!isProd, sourcemaps.init()))
      .pipe(gulpif(filename !== 'vendor.js', jshint()))
      .pipe(gulpif(filename !== 'vendor.js', jshint.reporter(stylish)))
		  .pipe(concat(filename))
		  .pipe(uglify())
		  .pipe(gulpif(!isProd, sourcemaps.write()))
		  .pipe(gulp.dest(dest));
	});
	return merge.apply(null, streams).pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(Object.keys(conf.js), ['scripts']);
  gulp.watch(_.map(conf.sprites, function (src) {
  	return src;
  }), ['sprites']);
  gulp.watch(_(conf.css).map(function (src) {
  	return src;
  }).flatten().value(), ['css']);
 	gulp.watch("./src/**/*.{html,png,jpeg,jpg}", ['copy']);
});

gulp.task('build', function(callback) {
  runSequence('clean', ['copy', 'css', 'scripts'], callback);
});


gulp.task('dev', ['setdev', 'build', 'watch']);
gulp.task('default', ['build']);
