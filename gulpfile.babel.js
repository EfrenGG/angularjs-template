const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const templateCache = require('gulp-angular-templatecache');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const server = require('browser-sync');

const root = 'src/';
const paths = {
    dist: './dist/',
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
    pixeladmin_theme: 'candy-cyan',
    static: [
        `${root}/index.html`,
        `${root}/img/**/*`
    ]
};
server.create();

gulp.task('clean', done => del(paths.dist + '**/*', done));

gulp.task('grid_fonts', ['clean'], () =>
    gulp.src('node_modules/angular-ui-grid/fonts/**/*')
        .pipe(gulp.dest(`${paths.dist}css/fonts/`))
);

gulp.task('fontawesome', () =>
    gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
        .pipe(gulp.dest(`${paths.dist}webfonts/`))
);

gulp.task('fonts', [
    'grid_fonts',
    'fontawesome',
]);

gulp.task('copy', ['fonts'], () =>
    gulp.src(paths.static, { base: 'src' })
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

gulp.task('modules', ['templates'], () =>
    gulp.src([
        ...paths.modules.map(item => 'node_modules/' + item),
        `${root}/pixeladmin/js/**/*.js`])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.dist + 'js/'))
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
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist + 'js/'))
);

gulp.task('vendor_css', () => gulp.src([
    ...paths.css_modules.map(item => 'node_modules/' + item),
    `${root}/pixeladmin/css/*.css`,
    `${root}/pixeladmin/css/themes/${paths.pixeladmin_theme}.min.css`])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.dist + 'css/'))
);

gulp.task('styles', [
    'vendor_css',
]);

gulp.task('serve', ['styles', 'scripts'], () => server.init({
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
    'copy',
    'watch'
]);
