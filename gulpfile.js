const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename"); // Zum Umbenennen von Dateien

// Pfade
const paths = {
    styles: {
        main: "app/styles.sass", // Nur styles.sass wird kompiliert
        watch: "app/**/*.{sass,scss}",  // Alle SASS-Dateien im app-Ordner und Unterordnern
        dest: "dist/",
    },
};

// Generiert die unminifizierte styles.css
function stylesPlain() {
    return gulp
        .src(paths.styles.main)
        .pipe(sass().on("error", sass.logError)) // Nur SASS kompilieren
        .pipe(rename("styles.css")) // Umbenennen in styles.css
        .pipe(gulp.dest(paths.styles.dest)); // Ziel: dist/styles.css
}

// Generiert die minifizierte styles-min.css mit Autoprefixer und Sourcemap
function stylesMinified() {
    return gulp
        .src(paths.styles.main)
        .pipe(sourcemaps.init()) // Startet Sourcemaps
        .pipe(sass().on("error", sass.logError)) // Kompiliert SASS
        .pipe(postcss([autoprefixer()])) // Fügt Autoprefixer hinzu
        .pipe(cleanCSS()) // Minifiziert CSS
        .pipe(rename("styles-min.css")) // Umbenennen in styles-min.css
        .pipe(sourcemaps.write(".")) // Schreibt Sourcemap (styles-min.css.map)
        .pipe(gulp.dest(paths.styles.dest)); // Ziel: dist/styles-min.css
}

// Watch Task für Änderungen
function watch() {
    gulp.watch(paths.styles.watch, gulp.series(stylesPlain, stylesMinified));
}

// Standard-Task (gulp)
exports.default = gulp.series(stylesPlain, stylesMinified);

// Build-Task für Prod
exports.build = gulp.series(stylesPlain, stylesMinified);

// Watch Task
exports.watch = watch;