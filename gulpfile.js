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

var postcss = require('gulp-postcss');

var reload = browserSync.reload;


//
//
//Image tasks - resizing, optimization
//
//

gulp.task('opt', function() {
    del('dist/assets/*');
    return gulp.src('src/assets/**/*.jpg src/assets/**/*.jpeg src/assets/**/*.png src/assets/**/*.gif src/assets/**/*.svg')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}],
            multipass: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('opt_res', function() {
    del('dist/images/**/*');
    return gulp.src('dist/img_res/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}],
            multipass: true,
            optimizationLevel: 7,
            use: [pngquant()]
        }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('res', function() {
    del('dist/img_res/*');
    
    var orig = gulp.src('src/images/**/*')
    .pipe(rename(function (path) { path.basename += ""; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
     var orig2 = gulp.src('src/images/**/*')
    .pipe(imageResize({ 
      width : 150,
      height : 150,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-100"; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
    var orig3 = gulp.src('src/images/**/*')
    .pipe(imageResize({ 
      width : 400,
      height : 400,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-400"; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
    var orig4 = gulp.src('src/images/**/*')
    .pipe(imageResize({ 
      width : 700,
      height : 700,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-700"; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
    var orig5 =  gulp.src('src/images/**/*')
    .pipe(imageResize({ 
      width : 1000,
      height : 1000,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-1000"; }))
    .pipe(gulp.dest('dist/img_res'));
    
    return merge(orig,orig2,orig3,orig4,orig5);
});

gulp.task('default',['res'], function() {
	gulp.start('opt_res');
});


//
//
//CSS tasks - postcss,production,analytics
//
//

gulp.task('css', function() {
    gulp.src('src/css/style.css')
    .pipe(sourcemap.init())
  	.pipe(postcss([ require('precss'),
                    require('postcss-raw').inspect(),
                    require('postcss-brand-colors'),
                    require('postcss-color-palette')({palette: 'material'}),
                    require('postcss-currency'),
                    require('postcss-instagram'),
                    require('immutable-css'),
                    require('postcss-input-style'),
                    require('laggard'),
                    require('autoprefixer')({browsers: ['> 1%'],}),
                    require('css-mqpacker'),
                    require('postcss-import-url'),
                    require('postcss-raw').write(),
                    require('postcss-reporter')]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('css-analytics', function() {
    gulp.src('dist/css/style.css')
  	.pipe(postcss([ require('colorguard'),
                    /*require('doiuse')({browsers:['ie >= 6', '> 1%'],onFeatureUsage: function (usageInfo) {
      console.log(usageInfo.message)
    }}),*/
                    require('postcss-cssstats')(function(stats) {console.log(stats);})]));
});

var nano = require('gulp-cssnano');

gulp.task('css-production', function() {
    gulp.src('dist/css/style.css')
    .pipe(nano({discardComments: {removeAll: true}}))
    .pipe(gulp.dest('production/css'));
});

gulp.task('css-colorblind', function() {
    gulp.src('src/css/style.css')
    .pipe(sourcemap.init())
  	.pipe(postcss([ require('precss'),
                    require('postcss-raw').inspect(),
                    require('postcss-brand-colors'),
                    require('postcss-color-palette')({palette: 'material'}),
                    require('postcss-currency'),
                    require('postcss-instagram'),
                    require('postcss-input-style'),
                    require('colorblind')({method:'achromatopsia'}),
                    require('laggard'),
                    require('autoprefixer')({browsers: ['> 1%'],}),
                    require('css-mqpacker'),
                    require('postcss-import-url'),
                    require('postcss-raw').write(),
                    require('postcss-reporter')]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('test/css'));
});
//precss
//raw
//brandcolor
//colorpalette
//currency
//instagram
//colorblind
//input-style
//laggard
//autoprefixer
//node-css-mqpacker
//import-url
//reporter

gulp.task('css-style-guide', function() {
    gulp.src('src/css/style.css')
    .pipe(sourcemap.init())
  	.pipe(postcss([ require('precss'),
                    require('postcss-raw').inspect(),
                    require('postcss-brand-colors'),
                    require('postcss-color-palette')({palette: 'material'}),
                    require('postcss-currency'),
                    require('postcss-instagram'),
                    require('postcss-input-style'),
                    require('laggard'),
                    require('autoprefixer')({browsers: ['> 1%'],}),
                    require('mdcss')({theme: require('mdcss-theme-github')({title: 'Test',examples: {css: ['style.css','../dist/css/style.css'], base: ''}})}),
                    require('postcss-raw').write(),
                    require('postcss-reporter')]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('styleguide/style2/'));
});
//precss
//brandcolor
//colorpalette
//currency
//instagram
//input-style
//laggard
//autoprefixer
//style-guide
//mdcss
//reporter


//
//
//HTML tasks - minification, linting
//
//


gulp.task('html', function() {
    gulp.src('src/html/*.html')
  	.pipe(plumber())
    .pipe(prettyUrl())
    .pipe(gulp.dest('dist'));
});

//
//
//JS Tasks
//
// 

gulp.task('js', function() {
	gulp.src('src/js/*.js')
	.pipe(plumber())
	.pipe(sourcemap.init())
	.pipe(coffee({bare: true}).on('error', util.log))
	.pipe(concat('script.js'))
	.pipe(sourcemap.write())
	.pipe(jshint())
	.pipe(gulp.dest('dist/js'));
});


//
//
//Server task
//
//

gulp.task('server', function() {

	browserSync.init({
        server: "./dist/",
        startPath: "/"
    });

});

//
//
//Default tasks
//
//

gulp.task('watch', ['server'], function() {
 
  // Watch .scss files
  watch('src/css/**/*.css', function(){
  	gulp.start('css');
  });
 
  // Watch .coffe files
  watch('src/js/**/*.js', function(){
  	gulp.start('js');
  });
 
  // Watch .html files
  watch('src/html/**/*.html', function(){
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


