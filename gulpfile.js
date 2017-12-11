'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const clean = require('gulp-clean');

const webpack = require('webpack');
const webpackConf = require('./webpack.config');
const args = require('yargs').argv;

const srcDir = process.cwd() + '/src';
const distDir = process.cwd() + '/dist';

// clean dist dir
// gulp.task('clean', () => gulp.src(distDir, {read: true}).pipe(clean()));
gulp.task('clean', function(){
    return gulp.src(distDir, {read: false}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    })
});

// html process
gulp.task('default', ['pack']);



