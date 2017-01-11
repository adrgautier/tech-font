var async = require('async');
var gulp = require('gulp');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var randomstring = require('randomstring');
var plumber = require('gulp-plumber');
var foreach = require('gulp-foreach');
 
gulp.task('tech-font', function(done){
  var iconStream = gulp.src(['resources/icons/*.svg'])
    .pipe(plumber())
	.pipe(iconfont({
        normalize: true,
        fontHeight: 1001,
        fontName: 'tech-font',
        formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
    }))

  async.parallel([
	function handleGlyphs (callback) {
	  iconStream.on('glyphs', function(glyphs, options) {
		gulp.src('resources/templates/font.css.twig')
          .pipe(plumber())
		  .pipe(consolidate('twig', {
			glyphs: glyphs,
			fontName: 'tech-font',
			fontPath: '../fonts/',
			className: 'tf',
			random: randomstring.generate(6)
		  }))
          .pipe(rename('tech-font.css'))
		  .pipe(gulp.dest('dist/css/'))
		  .on('finish', function(){
            /* generating the demo  */
            gulp.src('resources/templates/demo.html.twig')
                .pipe(plumber())
                .pipe(consolidate('twig', {
                    glyphs: glyphs
                }))
                .pipe(rename('demo.html'))
                .pipe(gulp.dest('dist/'))
                .on('finish', callback);
          });
	  });
	},
	function handleFonts (callback) {
	  iconStream
		.pipe(gulp.dest('dist/fonts/'))
		.on('finish', callback);
	}
  ], done);
});

gulp.task('default',['tech-font']);

gulp.task('test', function(){
    return gulp
    .src(['resources/icons/*.svg'])
    .pipe(foreach(function(stream, file){
        console.log(file.path);
        return stream
        .pipe(plumber())
        .pipe(iconfont({
            normalize: true,
            fontHeight: 1001,
            fontName: 'tech-font', // required 
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
        }));
    }))
});