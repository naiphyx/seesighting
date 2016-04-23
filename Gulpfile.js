var gulp = require('gulp');
var sass = require('gulp-sass');
var browsersync = require('browser-sync').create();

gulp.task('styles', function() {
	return gulp.src('app/css/*.scss')
			.pipe(sass())
			.pipe(gulp.dest('dist'))
			.pipe(browsersync.stream());
}); 

gulp.task('copy', function() {
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
	browsersync.init({
		server: './app'
	});

	gulp.watch('app/css/*.scss', ['styles']);
	gulp.watch('app/*.html').on('change', browsersync.reload);
});

gulp.task('default', ['styles', 'copy', 'serve']);