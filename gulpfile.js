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
var es = require('event-stream');
var util = require('gulp-util');
var browserSync = require('browser-sync').create();
var checkPages = require('check-pages');
//var fav = require('gulp-favicons');
var grunt = require('grunt');
var ps = require('grunt-pagespeed');
//var penthouse = require('grunt-penthouse');
var phantomas = require('grunt-phantomas');
var wpt = require('grunt-wpt');
//var aria = require('gulp-arialinter');
var autoprefixer = require('gulp-autoprefixer');
var bench = require('gulp-bench');
var cached = require('gulp-cached');
var cdnify = require('gulp-cdnify');
var changed = require('gulp-changed');
var closureCompiler = require('gulp-closure-compiler');
var coffee = require('gulp-coffee')
var concat = require('gulp-concat');
//var concat-css = require('gulp-concat-css');
var connect = require('gulp-connect');
var csscomb = require('gulp-csscomb');
var csscombLint = require('gulp-csscomb-lint');
var csslint = require('gulp-csslint');
var csso = require('gulp-csso');
var filesize = require('gulp-filesize');
var git = require('gulp-git');
var gulpGrunt = require('gulp-grunt');
var html = require('gulp-html');
var htmlVal = require('gulp-html-validator');
var htmlmin = require('gulp-htmlmin');
var inlineCss = require('gulp-inline-css');
var jshint = require('gulp-jshint');
var manifest = require('gulp-manifest');
var minCss = require('gulp-minify-css');
var newer = require('gulp-newer');
var prettyUrl = require('gulp-pretty-url');
var remember = require('gulp-remember');
var robots = require('gulp-robots');
var sass = require('gulp-sass');
var sitemap = require('gulp-sitemap');
var sourcemap = require('gulp-sourcemaps');
var specialHtml = require('gulp-special-html');
var stylestats = require('gulp-stylestats');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var w3cCss = require('gulp-w3c-css');
var watch = require('gulp-watch');
var zip = require('gulp-zip');
var ftp = require('vinyl-ftp');

var reload = browserSync.reload;


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

gulp.task('css', function() {
    gulp.src('src/css/style.scss')
  	.pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({ style: 'expanded'}))
    .pipe(sourcemap.write({includeContent: false}))
    .pipe(sourcemap.init({loadMaps: true}))
    .pipe(autoprefixer({
            browsers: ['> 1%'],
            cascade: true
        }))
    .pipe(concat('style.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist/css'));
    //.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('html', function() {
    gulp.src('src/*.html')
  	.pipe(plumber())
    .pipe(prettyUrl())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
	gulp.src('src/js/*.coffee')
	.pipe(plumber())
	.pipe(sourcemap.init())
	.pipe(coffee({bare: true}).on('error', util.log))
	.pipe(concat('script.js'))
	.pipe(sourcemap.write())
	.pipe(jshint())
	.pipe(gulp.dest('dist/js'));
});

gulp.task('server', function() {

	browserSync.init({
        server: "./dist/",
        startPath: "/"
    });

});

gulp.task('watch', ['server'], function() {
 
  // Watch .scss files
  watch('src/css/*.scss', function(){
  	gulp.start('css');
  });
 
  // Watch .coffe files
  watch('src/js/*.coffee', function(){
  	gulp.start('js');
  });
 
  // Watch .html files
  watch('src/*.html', function(){
  	gulp.start('html')
  });
 
  // Watch any files in dist/, reload on change
  watch('dist/**/*.*', function(){
  	browserSync.reload();
  });
 
});

gulp.task('default',['css','js','html'], function() {
    gulp.start('watch');
});


