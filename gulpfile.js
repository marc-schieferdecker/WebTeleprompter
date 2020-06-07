'use strict';

let gulp = require('gulp');
let concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
let minify = require('gulp-minify');
let gulpCopy = require('gulp-copy');

function libs() {
    return gulp
        .src([
            'node_modules/store2/dist/store2.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery.cookie/jquery.cookie.js',
            'node_modules/jquery-ui-dist/jquery-ui.js',
            'node_modules/jsrender/jsrender.js',
            'node_modules/toastr/build/toastr.min.js',
            'node_modules/hammerjs/hammer.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            'node_modules/tinymce-i18n/langs5/de.js',
            'node_modules/object-hash/dist/object_hash.js',
            'node_modules/spectrum-colorpicker/spectrum.js',
            'node_modules/socket.io-client/dist/socket.io.js'
        ])
        .pipe(concat('libs.js'))
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('resources/public/lib/js'));
}

function tinymce() {
    return gulp
        .src(['node_modules/tinymce/**/*'])
        .pipe(gulpCopy('resources/public/lib/tinymce/', { prefix: 2 }));
}

function css() {
    return gulp
        .src([
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/@fortawesome/fontawesome-free/css/all.css',
            'node_modules/toastr/build/toastr.css',
            'node_modules/tinymce/skins/ui/oxide/skin.mobile.css',
            'node_modules/tinymce/skins/ui/oxide/content.mobile.css',
            'node_modules/tinymce/skins/content/default/content.css',
            'node_modules/spectrum-colorpicker/spectrum.css'
        ])
        .pipe(cleanCSS())
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest('resources/public/lib/css'));
}

function copyWebfonts() {
    return gulp
        .src(['node_modules/@fortawesome/fontawesome-free/webfonts/*'])
        .pipe(gulpCopy('resources/public/lib/webfonts/', { prefix: 4 }));
}

const build = gulp.series(gulp.parallel(css, libs, tinymce, copyWebfonts));

exports.build = build;
