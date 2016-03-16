import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const config = {
  src: 'src/**/*.js',
  dist: 'dist'
};

gulp.task('watch', () => {
  gulp.watch(config.src, ['default']);
});

gulp.task('default', () => {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015', 'stage-0'],
      plugins: ['transform-runtime']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});
