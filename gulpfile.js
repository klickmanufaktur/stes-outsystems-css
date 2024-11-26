const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename"); // Zum Umbenennen von Dateien
const path = require("path"); // Zum Arbeiten mit Dateipfaden

// Pfade
const paths = {
    styles: {
        src: "app/*.sass", // Alle .sass-Dateien im app-Ordner (keine Unterordner)
        watch: "app/**/*.{sass,scss}", // Alle SASS/SCSS-Dateien im app-Ordner und Unterordnern
        dest: "dist/", // Zielordner für CSS-Dateien
    },
};

// Generiert die unminifizierten CSS-Dateien
function stylesPlain() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass().on("error", sass.logError)) // Kompiliert SASS
        .pipe(
            rename(function (file) {
                file.extname = ".css"; // Ändert die Dateiendung auf .css
            })
        )
        .pipe(gulp.dest(paths.styles.dest)); // Ziel: dist/
}

// Generiert die minifizierten CSS-Dateien mit Autoprefixer und Sourcemap
function stylesMinified() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init()) // Startet Sourcemaps
        .pipe(sass().on("error", sass.logError)) // Kompiliert SASS
        .pipe(postcss([autoprefixer()])) // Fügt Autoprefixer hinzu
        .pipe(cleanCSS()) // Minifiziert CSS
        .pipe(
            rename(function (file) {
                file.basename += "-min"; // Fügt "-min" zum Dateinamen hinzu
                file.extname = ".css"; // Ändert die Dateiendung auf .css
            })
        )
        .pipe(sourcemaps.write(".")) // Schreibt Sourcemap (z.B. styles-min.css.map)
        .pipe(gulp.dest(paths.styles.dest)); // Ziel: dist/
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
