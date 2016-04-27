var gulp = require('gulp');
var sass = require('gulp-sass');
var browsersync = require('browser-sync').create();

gulp.task('styles', function() {
	return gulp.src('app/css/*.scss')
			.pipe(sass())
			.pipe(gulp.dest('dist/css'))
			.pipe(browsersync.stream());
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
			.pipe(gulp.dest('dist/js'))
			.pipe(browsersync.stream());
})

gulp.task('assets', function() {
	return gulp.src('app/assets/**/*')
			.pipe(gulp.dest('dist'))
			.pipe(browsersync.stream());
})

gulp.task('copy', function() {
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'))
	.pipe(browsersync.stream());
});

gulp.task('serve', function() {
	browsersync.init({
		server: './dist'
	});

	gulp.watch('app/css/*.scss', ['styles']);
	gulp.watch('app/js/*js', ['scripts']);
	gulp.watch('app/*.html', ['copy']);
	gulp.watch('app/assets/**/*', ['assets']);
});

gulp.task('default', ['styles', 'scripts', 'copy', 'assets', 'serve']);
