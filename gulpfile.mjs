// eslint-env node, es6
// Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
import gulp from 'gulp';
const { src, dest, series } = gulp;

import zip from 'gulp-zip';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
//import browserSyncCreator from 'browser-sync';
//const browserSync = browserSyncCreator.create();
import babel from 'gulp-babel';
import maps from 'gulp-sourcemaps';
import gap from 'gulp-append-prepend';
import sassModule from 'gulp-sass';
import sassCompiler from 'sass';
const sass = sassModule(sassCompiler);

const origin = 'src';
const destination = 'dist';
const sassSrc = `${origin}/components/scss/`;
const cssDest  = `${destination}/assets/css/`;
const jsSrc  = `${origin}/components/scripts/image-fetcher.js`;
const jsDest  = `${destination}/assets/scripts/`;
const imgSrc = `${origin}/assets/img/`;
const imgDest = `${destination}/assets/img/`;

const sassOptions = {
  outputStyle: 'expanded'
};

const sassMinOptions = {
  outputStyle: 'compressed'
};

const prefixerOptions = {
  browsers: ['last 2 versions']
};

function css(cb) {
  src(`${sassSrc}style.scss`)
    .pipe(maps.init())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(dest(cssDest));
  
  cb();
}

function js(cb) {
  src(jsSrc)
    .pipe(maps.init())
    .pipe(babel({
      compact: false,
      presets: ['@babel/env']
    }))
	  //.pipe(concat(`${themeName}.js`))
	  //.pipe(uglify())
    .pipe(maps.write('./'))
    .pipe(dest(jsDest));
  
    cb();
  }

function html(cb) {
    src(`${origin}/**/*.html`).pipe(dest(destination));
    cb();
  }   

function img(cb){
  src([
    `${imgSrc}/**/*.png`,
    `${imgSrc}/**/*.jpg`,
    `${imgSrc}/**/*.jpeg`,
    `${imgSrc}/**/*.gif`,
    `${imgSrc}/**/*.svg`]).pipe(dest(imgDest));

    src(`${origin}/*.png`).pipe(dest(destination));

  cb();
}  

export const build = series(html,css,js,img);