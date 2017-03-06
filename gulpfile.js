var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require("gulp-uglify"),
  gulpif = require("gulp-if"),
  htmlmin = require('gulp-htmlmin'),
  ngAnnotate = require('gulp-ng-annotate'),
  zip = require('gulp-zip'),
  clean = require('gulp-clean'),
  ignore = require('gulp-ignore'),
  useref = require('gulp-useref'),
  cleanCss = require('gulp-clean-css'),
  less = require('gulp-less'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),
  runSequence = require('run-sequence');

/* --------- version control ------------- */

gulp.task('clean', function () {
  return gulp.src('dest', {read: false}).pipe(clean());
});

gulp.task('default', function (callback) {
  runSequence(
    'simple',
    'simpleLogin',
    'simpleRegister',
    ['simpleApp','simpleImages','simpleFonts'],
    'simpleZip',
    callback);
});

gulp.task('simple', ['clean'], function () {
  return gulp.src('src/index.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCss()))
    .pipe(gulp.dest('dest/version'))
});

gulp.task('simpleLogin', function () {
  return gulp.src('src/login.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCss()))
    .pipe(gulp.dest('dest/version'))
});
gulp.task('simpleRegister', function () {
  return gulp.src('src/register.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCss()))
    .pipe(gulp.dest('dest/version'))
});

gulp.task('simpleApp', function () {
  return gulp.src('src/app/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dest/version/app'))
});
gulp.task('simpleImages', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dest/version/img'))
});
gulp.task('simpleFonts', function () {
  return gulp.src('src/fontawesome/fonts/**/*')
    .pipe(gulp.dest('dest/version/fontawesome/fonts'))
});
gulp.task('simpleZip', function () {
  return gulp.src(['dest/version/**/*'])
    .pipe(zip('lifetime.zip'))
    .pipe(gulp.dest("dest"));
});



