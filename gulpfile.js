'use strict';

var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'), // Load all gulp plugins automatically
	plugins = gulpLoadPlugins(),

	stylish = require('jshint-stylish'),
	browserSync = require('browser-sync'),
	pngquant = require('imagemin-pngquant'),
	reload = browserSync.reload,
	pkg = require('./package.json'), // Include directories from package.json configs
	dirs = pkg['configs'].directories,

	// General files
	_files = ['*.html', 'build/**/*'];

	// IMAGES ==================================================

		// Imagemin

			gulp.task('imagemin', function() {
				return gulp.src(dirs._assets+'/img/*')
							.pipe(plugins.imagemin({
								progressive: true,
								intercaled: true,
								use: [pngquant]
							}))
							.pipe(gulp.dest(dirs._build+'/img'));
			});

	// STYLES ==================================================

		// main.min.css

			gulp.task('sass', function() {
				return gulp.src(dirs._assets+'/scss/a2lego.scss')
							.pipe(plugins.sourcemaps.init())
							.pipe(plugins.rename({suffix: '.min'}))
							.pipe(plugins.sass({
								outputStyle: 'compressed'
							}))
							.on(plugins.sass(), plugins.sass.logError)
							.pipe(plugins.sourcemaps.write('./maps'))
							.pipe(gulp.dest(dirs._build+'/css'))
							.pipe(plugins.livereload())
							.pipe(reload({stream: true}));
			});

	// SCRIPTS ================================================

		// JSHint

			gulp.task('lint', ['concat'], function() {
				return gulp.src(dirs._assets+'/js/*.js')
							.pipe(plugins.jshint())
							.pipe(plugins.jshint.reporter(stylish))
							.pipe(plugins.jshint.reporter('default'));
			});

	// BROWSER SYNC ===========================================

			gulp.task('browser-sync', function() {
				browserSync.init({
					proxy: 'http://127.0.0.1:8080/' // Proxy do server
				});
			});

	// WATCH ==================================================

			gulp.task('watch', function() {

				// Livereload

					plugins.livereload.listen();

				// Watch files

					gulp.watch('*.html').on('change', function() {
						plugins.livereload.changed('/*.html');
					});

				// Watch JS

					gulp.watch([dirs._assets+'/js/*.js'], ['lint']);

				// Watch CSS

					gulp.watch([dirs._assets+'/scss/**/*.scss'], ['sass']);

				// Watch images

					gulp.watch([dirs._assets+'/img/*'], ['imagemin']);
			});

	// RUN TASKS ===============================================

			gulp.task('default', ['watch']);
			gulp.task('images', ['imagemin']);
			gulp.task('sync', ['watch', 'browser-sync']);
			gulp.task('css', ['sass']);
			gulp.task('js', ['lint', 'concat']);








