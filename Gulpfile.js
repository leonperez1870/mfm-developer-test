'use strict';
const { src, dest, watch, series, parallel } = require('gulp');
const babel         = require('gulp-babel'),
      autoprefixer  = require('gulp-autoprefixer'),
      sass          = require('gulp-sass'),
      plumber       = require('gulp-plumber'),
      connect       = require('gulp-connect'),
      include       = require('gulp-include'),
      rename        = require('gulp-rename'),
      concat        = require('gulp-concat'),
      uglify        = require('gulp-uglify');

const autoprefixerOptions = {
  overrideBrowserslist : ['last 3 versions', '> 5%', 'Explorer >= 10', 'Safari >= 8'],
  cascade : false
},
sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed'
},
babelOptions = {
  presets: ['@babel/preset-env']
};

async function connectServer() {
  connect.server({
    root: '.',
    livereload: true
  })
}

async function scss() {
  return src('assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename('styles.css'))
    .pipe(dest('./dist/'))
    .pipe(connect.reload())
}

async function js() {
  return src('assets/js/**/*.js')
    .pipe(plumber())
    .pipe(babel(babelOptions))
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(dest('./dist/'))
    .pipe(connect.reload())
}

async function html() {
  return src('index.html')
    .pipe(connect.reload())
}

async function vendorCss() {
  return src('assets/vendors/css/*.css')
    .pipe(plumber())
    .pipe(concat('vendors.css'))
    .pipe(dest('./dist/'))
}

async function vendorJs() {
  return src('assets/vendors/js/vendors.js')
    .pipe(plumber())
    .pipe(include())
      .on('error', console.log)
    .pipe(dest('./dist/'))
}

async function listen() {
  watch('assets/scss/**/*.scss', series(scss));
  watch('assets/js/**/*.js', series(js));
  watch('index.html', series(html));
  watch('assets/vendors/css/*.css', series(vendorCss));
  watch('assets/vendors/js/**/*.js', series(vendorJs));
}

const build = parallel(html, scss, js, vendorJs, vendorCss, listen, connectServer);
exports.default = build;
