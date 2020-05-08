const { src, dest, series, watch, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const uglifycss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const webserver = require('gulp-webserver');
const sass = require('gulp-sass');
const babelify = require('babelify');

sass.compiler = require('node-sass');

// browserify().transform("babelify", {
//   global: true,
//   ignore: /\/node_modules\/(?!app\/)/
// });

const bundleJs = () => {
  return src('./src/tools/**/*.tool.js')
    .pipe(
      browserify({
        insertGlobals: true,
        global: true,
        transform: [
          babelify.configure({
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            presets: ['@babel/preset-env'],
          }),
        ],
      })
    )
    .pipe(uglify())
    .pipe(
      rename((path) => {
        path.basename = path.basename.replace('.tool', '.bundle.min');
      })
    )
    .pipe(dest('./dist/tools/assets/js'));
};

const copyHtml = () => {
  return src('./src/tools/**/*.tool.html')
    .pipe(
      rename((path) => {
        path.dirname = '';
        path.basename = path.basename.replace('.tool', '');
      })
    )
    .pipe(dest('./dist/tools/'));
};

const compileToolStyles = () => {
  return src('./src/tools/**/*.tool.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss())
    .pipe(
      rename((path) => {
        path.dirname = '';
        path.basename = path.basename.replace('.tool', '.bundle.min');
      })
    )
    .pipe(dest('./dist/tools/assets/css'));
};

const compileGlobalStyles = () => {
  return src('./src/tools/core/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss())
    .pipe(
      rename((path) => {
        path.dirname = '';
      })
    )
    .pipe(dest('./dist/tools/assets/css'));
};

const watchBuilderJs = () => {
  return watch('./src/tools/**/*.js', series(bundleJs));
};

const watchBuilderHtml = () => {
  return watch('./src/tools/**/*.html', series(copyHtml));
};

const watchBuilderToolStyles = () => {
  return watch('./src/tools/**/*.tool.scss', series(compileToolStyles));
};

const watchBuilderGlobalStyles = () => {
  return watch('./src/tools/core/**/*.scss', series(compileGlobalStyles));
};

const cleanDist = () => {
  return src('./dist', { read: false, allowEmpty: true }).pipe(clean());
};

const copyAssets = () => {
  return src('./src/assets/**/*').pipe(dest('./dist/tools/assets'));
};

const serve = () => {
  return src('./dist/').pipe(
    webserver({
      livereload: true,
      directoryListing: true,
    })
  );
};

exports.build = series(cleanDist, bundleJs, copyHtml, compileToolStyles, compileGlobalStyles, copyAssets);
exports.serve = series(
  cleanDist,
  bundleJs,
  copyHtml,
  compileToolStyles,
  compileGlobalStyles,
  copyAssets,
  parallel(watchBuilderJs, watchBuilderHtml, watchBuilderToolStyles, watchBuilderGlobalStyles, serve)
);
