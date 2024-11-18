const gulp = require("gulp");
const sass = require("gulp-dart-sass"); // Verwende gulp-dart-sass
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const yargs = require("yargs");

// Flags
const argv = yargs.argv;
const isProduction = argv.prod; // --prod Flag für Produktionsmodus
const shouldMinify = argv.min;  // --min Flag für CSS-Minimierung

// Pfade
const paths = {
    styles: {
        main: "app/styles.sass", // Nur styles.sass wird kompiliert
        watch: "app/**/*.sass",  // Alle SASS-Dateien für Watcher
        dest: "dist/",
    },
};

// SASS kompilieren
function styles() {
    return gulp
        .src(paths.styles.main)
        .pipe(gulpIf(isProduction, sourcemaps.init())) // Sourcemaps starten, nur bei --prod
        .pipe(sass({
            silenceDeprecations: ['legacy-js-api'],
        }))
        .pipe(gulpIf(isProduction || shouldMinify, postcss([autoprefixer()]))) // Autoprefixer für prod oder --min
        .pipe(gulpIf(isProduction || shouldMinify, cleanCSS())) // Minimierung bei --prod oder --min
        .pipe(gulpIf(isProduction, sourcemaps.write('.'))) // Sourcemaps schreiben
        .pipe(gulp.dest(paths.styles.dest));
}

// Watch Task für Änderungen
function watch() {
    gulp.watch(paths.styles.watch, styles); // Watch alle SASS-Dateien
}

// Tasks exportieren
exports.styles = styles;
exports.watch = watch;

// Standard-Task für Entwicklung
exports.default = gulp.series(styles, watch);

// Build-Task für Prod
exports.build = gulp.series(styles);
