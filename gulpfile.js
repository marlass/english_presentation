var gulp = require('gulp');

var del = require('del');
var duration = require('gulp-duration');
var size = require('gulp-filesize');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var babel = require('gulp-babel');
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
    del.sync('dist/assets/*');
    return gulp.src('src/assets/**/*.jpg src/assets/**/*.jpeg src/assets/**/*.JPG src/assets/**/*.JPEG src/assets/**/*.png src/assets/**/*.gif src/assets/**/*.svg')
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
    del.sync('dist/images/**/*');
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
    del.sync('dist/img_res/*');
    
    var orig = gulp.src('src/images/**/*')
    .pipe(rename(function (path) { path.basename += ""; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
    var orig2 = gulp.src('src/images/**/*')
    .pipe(imageResize({ 
      width : 660,
      //height : 150,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-660"; }))
    .pipe(gulp.dest('dist/img_res'));
    
    
    //var orig3 = gulp.src('src/images/**/*')
    /*.pipe(imageResize({ 
      width : 400,
      height : 400,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-400"; }))
    .pipe(gulp.dest('dist/img_res'));*/
    
    
    //var orig4 = gulp.src('src/images/**/*')
    /*.pipe(imageResize({ 
      width : 700,
      height : 700,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-700"; }))
    .pipe(gulp.dest('dist/img_res'));*/
    
    
    //var orig5 =  gulp.src('src/images/**/*')
    /*.pipe(imageResize({ 
      width : 1000,
      height : 1000,
      crop : false,
      upscale : false,
      imageMagick : true
    }))
    .pipe(rename(function (path) { path.basename += "-1000"; }))
    .pipe(gulp.dest('dist/img_res'));*/
    
    return merge(orig,orig2/*,orig3,orig4,orig5*/);
});

gulp.task('clear-images', function() {
    return del.sync(['production/images/*','production/assets/*','test/images/*','test/assets/*']);
});

gulp.task('copy-images',['clear-images'], function(){
    gulp.src('dist/images/**/*')
    .pipe(gulp.dest('production/images/'));
    
    gulp.src('dist/images/**/*')
    .pipe(gulp.dest('test/images/'));
    
    gulp.src('dist/assets/**/*')
    .pipe(gulp.dest('production/assets/'));
    
    gulp.src('dist/assets/**/*')
    .pipe(gulp.dest('test/assets/'));
});

gulp.task('images',['res'], function() {
	gulp.start('opt_res');
});

gulp.task('pics',['images'], function() {
   gulp.start('copy-images');
});


//
//
//CSS tasks - postcss,production,analytics
//
//
gulp.task('clear-css-dist', function() {
    return del.sync(['dist/css/*']);
});


gulp.task('css',['clear-css-dist'], function() {
    return gulp.src('src/css/style.css')
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
    return gulp.src('dist/css/style.css')
  	.pipe(postcss([ require('colorguard'),
                    /*require('doiuse')({browsers:['ie >= 6', '> 1%'],onFeatureUsage: function (usageInfo) {
      console.log(usageInfo.message)
    }}),*/
                    require('postcss-cssstats')(function(stats) {console.log(stats);})]));
});

var nano = require('gulp-cssnano');

gulp.task('clear-css-production', function() {
    return del.sync(['production/css/*']);
});

gulp.task('css-production',['clear-css-production'], function() {
    return gulp.src('src/css/style.css')
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
    .pipe(nano({discardComments: {removeAll: true}}))
    .pipe(gulp.dest('production/css'));
});

gulp.task('clear-css-test', function() {
    return del.sync(['test/css/*']);
});

gulp.task('css-colorblind',['clear-css-test'], function() {
    return gulp.src('src/css/style.css')
    .pipe(sourcemap.init())
  	.pipe(postcss([ require('precss'),
                    require('postcss-raw').inspect(),
                    require('postcss-brand-colors'),
                    require('postcss-color-palette')({palette: 'material'}),
                    require('postcss-currency'),
                    require('postcss-instagram'),
                    require('postcss-input-style'),
                    require('postcss-colorblind')({method:'achromatopsia'}),
                    require('laggard'),
                    require('autoprefixer')({browsers: ['> 1%'],}),
                    require('css-mqpacker'),
                    require('postcss-import-url'),
                    require('postcss-raw').write(),
                    require('postcss-reporter')]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('test/css'));
});

gulp.task('css-styleguide', function() {
    return gulp.src('dist/css/style.css')
  	.pipe(postcss([ require('mdcss')({theme: require('mdcss-theme-github')({title: 'English presentation style-guide',examples: {css: ['style.css','../dist/css/style.css'], base: ''}})})]));
});


//
//
//HTML tasks - minification, linting
//
//
gulp.task('clear-html-dist', function() {
    return del.sync(['dist/*','dist/**/*','!dist/css','!dist/css/*','!dist/js','!dist/js/*','!dist/images','!dist/images/*','!dist/assets','!dist/assets/*']);
});

gulp.task('clear-html-production', function() {
    return del.sync(['production/*','production/**/*','!production/css','!production/css/*','!production/js','!production/js/*','!production/images','!production/images/*','!production/assets','!production/assets/*']);
});

gulp.task('clear-html-test', function() {
    return del.sync(['test/*','test/**/*','!test/css','!test/css/*','!test/js','!test/js/*','!test/images','!test/images/*','!test/assets','!test/assets/*']);
});

gulp.task('html',['clear-html-dist'], function() {
    return gulp.src('src/html/*.html')
  	.pipe(plumber())
    .pipe(prettyUrl())
    .pipe(gulp.dest('dist'));
});

gulp.task('html-production',['clear-html-production'], function() {
    return gulp.src('dist/**/*.html')
  	.pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('production'));
});

gulp.task('html-test',['clear-html-test'], function() {
    return gulp.src('dist/**/*.html')
  	.pipe(plumber())
    .pipe(gulp.dest('test'));
});

//
//
//JS Tasks
//
// 

gulp.task('clear-js-dist', function() {
    return del.sync(['dist/js/*','dist/libs/*']);
});

gulp.task('js',['clear-js-dist'], function() {
    gulp.src('src/libs/*')
        .pipe(gulp.dest('dist/libs/'));
    
	return gulp.src('src/js/**/*.js')
        .pipe(sourcemap.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('clear-js-production', function() {
    return del.sync(['production/js/*','production/libs/*']);
});

gulp.task('js-production',['clear-js-production'], function() {
    gulp.src('src/libs/*')
        .pipe(gulp.dest('production/libs/'));
        
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('production/js/'));
});

gulp.task('clear-js-test', function() {
    return del.sync(['test/js/*','test/libs/*']);
});


gulp.task('js-test',['clear-js-test'], function() {
    
    gulp.src('src/libs/*')
        .pipe(gulp.dest('test/libs/'));
        
	return gulp.src('dist/js/app.js')
        .pipe(gulp.dest('test/js/'));
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

gulp.task('server-production', function() {

	browserSync.init({
        server: "./production/",
        startPath: "/"
    });

});

gulp.task('server-test', function() {

	browserSync.init({
        server: "./test/",
        startPath: "/"
    });

});

gulp.task('server-styleguide', function() {

	browserSync.init({
        server: "./",
        startPath: "styleguide/"
    });

});

//
//
//Default tasks
//
//

gulp.task('watch', ['server'], function() {
 
  // Watch .css files
  watch('src/css/**/*.css', function(){
  	gulp.start('css');
  });
 
  // Watch .babel files
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

gulp.task('default',['css','js','html','opt','images'], function() {
    gulp.start('watch');
});

gulp.task('production',['css-production','js-production','html-production','copy-images'], function() {
    gulp.start('server-production');
});

gulp.task('test',['css-colorblind','js-test','html-test','copy-images'], function() {
    gulp.start('server-test');
});

gulp.task('styleguide',['css-styleguide'], function() {
    gulp.start('server-styleguide');
});

gulp.task('precommit',['css','js','html','opt'], function() {
    gulp.start('css-production');
    gulp.start('js-production');
    gulp.start('html-production');
    gulp.start('css-colorblind');
    gulp.start('js-test');
    gulp.start('html-test');
    gulp.start('css-styleguide');
    gulp.start('pics');
});


