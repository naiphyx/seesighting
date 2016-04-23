var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
	return gulp.src('app/css/*.scss')
			.pipe(sass())
			.pipe(gulp.dest('dist'));
}); 

gulp.task('copy', function() {
	return gulp.src('app/index.html')
	.pipe(gulp.dest('dist'));
}),

gulp.task('default', ['styles', 'copy']);