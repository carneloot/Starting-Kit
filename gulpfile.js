var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-ruby-sass');
var srcmaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var dirs = {
	site: 'build',
	source: 'source'
};

var jsVendors = [
	'jquery-3.1.1.min.js'
];

// Compile pug task

gulp.task('pug', function() {
	return gulp.src([dirs.source + '/pugs/**/*.pug', '!' + dirs.source + '/pugs/**/_*.pug'])
		.pipe(pug())
		.pipe(gulp.dest(dirs.site))
		.pipe(browserSync.reload({stream: true}));
});

// SASS + Autoprefixer + sourcemaps Task

gulp.task('sass', function() {
	return sass(dirs.source + '/assets/css/main.sass', { sourcemap: true, style: 'compact' })
		.on('error', sass.logError)
		.pipe(prefix('last 15 versions'))
		.pipe(srcmaps.write('/'))
		.pipe(gulp.dest(dirs.site + '/assets/css'))
		.pipe(browserSync.reload({stream: true}));
});

// browser-sync Task

gulp.task('browser-sync', function() {
	browserSync.init({
		server: { baseDir: dirs.site },
		notify: false
	});
});

gulp.task('js', function() {
		return gulp.src([dirs.source + '/assets/js/*.js', '!' + dirs.source + '/assets/js/**/_*.js'])
		.pipe(uglify())
		.pipe(gulp.dest(dirs.site + '/assets/js/'))
		.pipe(browserSync.reload({stream: true}));
});

// Watch task

gulp.task('watch', function() {
	gulp.watch(dirs.source + '/pugs/**', ['pug']);
	gulp.watch(dirs.source + '/assets/css/**', ['sass']);
	gulp.watch(dirs.source + '/assets/js/**', ['js']);
});

//

gulp.task('copyFiles', function(){
	return gulp.src([dirs.source + '/assets/**/*', '!' + dirs.source + '/assets/css/**', '!' + dirs.source + '/assets/js/**'])
		.pipe(gulp.dest(dirs.site + '/assets/'));
});

// Default GULP task

gulp.task('default', ['copyFiles', 'pug', 'sass', 'js', 'browser-sync', 'watch']);
