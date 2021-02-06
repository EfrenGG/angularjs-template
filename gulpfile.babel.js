/*eslint-env node*/
const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const ngAnnotate = require('gulp-ng-annotate');
const templateCache = require('gulp-angular-templatecache');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const uglify = require('gulp-uglify');
const server = require('browser-sync');
const yargs = require('yargs');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');

const argv = yargs.argv;
const root = 'src';
const paths = {
  dist: './dist',
  scripts: [`${root}/app/**/*.js`, `!${root}/app/**/*.spec.js`],
  tests: `${root}/app/**/*.spec.js`,
  styles: `${root}/styles/sass/*.scss`,
  templates: `${root}/app/**/*.html`,
  modules: [
    'jquery/dist/jquery.js',
    'angular/angular.js',
    'angular-animate/angular-animate.js',
    'angular-messages/angular-messages.js',
    'angular-route/angular-route.js',
    'angular-sanitize/angular-sanitize.js',
    'angular-touch/angular-touch.js',
    'angular-translate/dist/angular-translate.js',
    'angular-translate-loader-url/angular-translate-loader-url.js',
    'angular-ui-bootstrap/dist/ui-bootstrap.js',
    'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'angular-ui-grid/ui-grid.js',
    'bootstrap/dist/js/bootstrap.js',
    'toastr/toastr.js',
  ],
  css_modules: [
    'bootstrap/dist/css/bootstrap.min.css',
    'angular-ui-grid/ui-grid.min.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
  ],
  fonts: [
    { src: 'angular-ui-grid/fonts/**/*', dest: 'css/fonts/' },
    { src: 'bootstrap/dist/fonts/**/*', dest: 'fonts/' },
    {
      src: '@fortawesome/fontawesome-free/webfonts/**/*',
      dest: 'webfonts/',
    },
  ],
  pixeladmin_theme: 'clean',
  static: ['index.html', 'img/**/*'],
};

server.create();

gulp.task('clean', () => del(`${paths.dist}/**/*`));

gulp.task(
  'fonts',
  gulp.series('clean', (done) => {
    paths.fonts.forEach((font) => {
      gulp
        .src(`node_modules/${font.src}`)
        .pipe(gulp.dest(`${paths.dist}/${font.dest}`));
    });
    done();
  })
);

gulp.task(
  'vendor-css',
  gulp.series('fonts', () =>
    gulp
      .src([
        ...paths.css_modules.map((item) => 'node_modules/' + item),
        `${root}/pixeladmin/css/*.css`,
        `${root}/pixeladmin/css/themes/${paths.pixeladmin_theme}.min.css`,
      ])
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest(`${paths.dist}/css/`))
  )
);

gulp.task(
  'copy',
  gulp.series('vendor-css', () =>
    gulp
      .src(
        paths.static.map((item) => `${root}/${item}`),
        { base: 'src' }
      )
      .pipe(gulp.dest(paths.dist))
  )
);

gulp.task(
  'modules',
  gulp.series('copy', () =>
    gulp
      .src([
        ...paths.modules.map((item) => `node_modules/${item}`),
        `${root}/pixeladmin/js/**/*.js`,
      ])
      .pipe(
        gulpif(
          argv.deploy,
          babel({
            presets: ['@babel/env'],
          })
        )
      )
      .pipe(concat('vendor.js'))
      .pipe(gulpif(argv.deploy, uglify()))
      .pipe(gulp.dest(`${paths.dist}/js/`))
  )
);

gulp.task('styles', () =>
  gulp
    .src(paths.styles)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest(`${paths.dist}/css/`))
);

gulp.task('templates', () =>
  gulp
    .src(paths.templates)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      templateCache({
        root: 'app',
        standalone: true,
        transformUrl: (url) => url.replace(path.dirname(url), '.'),
      })
    )
    .pipe(gulp.dest(`${root}/app/`))
);

gulp.task(
  'scripts',
  gulp.series('templates', () =>
    gulp
      .src([
        `!${root}/app/**/*.spec.js`,
        `${root}/app/**/*.module.js`,
        ...paths.scripts,
      ])
      .pipe(gulpif(!argv.deploy, sourcemaps.init()))
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(wrap('(function(angular){\n<%= contents %>})(window.angular);'))
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(gulpif(argv.deploy, uglify()))
      .pipe(gulpif(!argv.deploy, sourcemaps.write('./')))
      .pipe(gulp.dest(`${paths.dist}/js/`))
  )
);

gulp.task(
  'serve',
  gulp.series('scripts', 'styles', () =>
    server.init({
      files: [`${paths.dist}/**`],
      port: 4000,
      server: {
        baseDir: paths.dist,
      },
    })
  )
);

gulp.task(
  'watch',
  gulp.series('serve', () => {
    gulp.watch([paths.scripts, paths.templates], ['scripts']);
    gulp.watch(paths.styles, ['styles']);
  })
);

gulp.task('default', gulp.series('modules', 'watch'));

gulp.task('bundle', gulp.series('modules', 'scripts', 'styles'));
