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

const root = 'src';
const paths = {
    dist: './dist',
    scripts: [`${root}/app/**/*.js`, `!${root}/app/**/*.spec.js`],
    tests: `${root}/app/**/*.spec.js`,
    styles: `${root}/sass/*.scss`,
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
        'toastr/toastr.js'
    ],
    css_modules: [
        'bootstrap/dist/css/bootstrap.min.css',
        'angular-ui-grid/ui-grid.min.css',
        '@fortawesome/fontawesome-free/css/all.min.css'
    ],
    fonts: [
        { src: 'angular-ui-grid/fonts/**/*', dest: 'css/fonts/' },
        { src: 'bootstrap/dist/fonts/**/*', dest: 'fonts/' },
        { src: '@fortawesome/fontawesome-free/webfonts/**/*', dest: 'webfonts/' },
    ],
    pixeladmin_theme: 'candy-cyan',
    static: [
        'index.html',
        'img/**/*',
    ]
};


server.create();

gulp.task('clean', done => del(`${paths.dist}/**/*`, done));

gulp.task('fonts', () => {
    paths.fonts.forEach(font => {
        gulp.src(`node_modules/${font.src}`)
            .pipe(gulp.dest(`${paths.dist}/${font.dest}`));
    });
});

gulp.task('vendor-css', ['fonts'], () => gulp.src([
    ...paths.css_modules.map(item => 'node_modules/' + item),
    `${root}/pixeladmin/css/*.css`,
    `${root}/pixeladmin/css/themes/${paths.pixeladmin_theme}.min.css`])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(`${paths.dist}/css/`))
);

gulp.task('copy', ['vendor-css'], () =>
    gulp.src(paths.static.map(item => `${root}/${item}`), { base: 'src' })
        .pipe(gulp.dest(paths.dist))
);

gulp.task('templates', () =>
    gulp.src(paths.templates)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(templateCache({
            root: 'app',
            standalone: true,
            transformUrl: url => url.replace(path.dirname(url), '.')
        }))
        .pipe(gulp.dest(`${root}/app/`))
);

gulp.task('modules', ['copy', 'templates'], () =>
    gulp.src([
        ...paths.modules.map(item => `node_modules/${item}`),
        `${root}/pixeladmin/js/**/*.js`])
        .pipe(concat('vendor.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(`${paths.dist}/js/`))
);

gulp.task('scripts', ['modules'], () =>
    gulp.src([
        `!${root}/app/**/*.spec.js`,
        `${root}/app/**/*.module.js`,
        ...paths.scripts
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(wrap('(function(angular){\n<%= contents %>})(window.angular);'))
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${paths.dist}/js/`))
);

gulp.task('serve', ['scripts'], () => server.init({
    files: [`${paths.dist}/**`],
    port: 4000,
    server: {
        baseDir: paths.dist
    }
}));

gulp.task('watch', ['serve'], () => {
    gulp.watch([paths.scripts, paths.templates], ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', [
    'watch',
]);
