var gulp = require('gulp');

var del = require('del');
var duration = require('gulp-duration');
var size = require('gulp-filesize');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var imageResize = require('gulp-image-resize');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


gulp.task('opt', function() {
    del('opt/*');
    return gulp.src('src/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}],
            multipass: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('opt'));
});

gulp.task('opt_res', function() {
    del('opt_res/*');
    return gulp.src('res/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}],
            multipass: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
    .pipe(gulp.dest('opt_res'));
});

gulp.task('res', function() {
    del('res/*');
    
    var orig = gulp.src('src/*')
    .pipe(rename(function (path) { path.basename += ""; }))
    .pipe(gulp.dest('res'));
    
    
     var orig2 = gulp.src('src/*')
    .pipe(imageResize({ 
      width : 150,
      height : 150,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-100"; }))
    .pipe(gulp.dest('res'));
    
    
    var orig3 = gulp.src('src/*')
    .pipe(imageResize({ 
      width : 400,
      height : 400,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-400"; }))
    .pipe(gulp.dest('res'));
    
    
    var orig4 = gulp.src('src/*')
    .pipe(imageResize({ 
      width : 700,
      height : 700,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-700"; }))
    .pipe(gulp.dest('res'));
    
    
    var orig5 =  gulp.src('src/*')
    .pipe(imageResize({ 
      width : 1000,
      height : 1000,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-1000"; }))
    .pipe(gulp.dest('res'));
    
    return merge(orig,orig2,orig3,orig4,orig5);
});



gulp.task('default',['res'], function() {
	gulp.start('opt_res');
});
