var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var spawn = require('child_process').spawn;
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var runSequence = require('gulp-run-sequence');
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var handlebars = require('gulp-compile-handlebars');

var zip = require('gulp-zip');


var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var replace = require('gulp-replace');


gulp.task('clean', function() { //清除原先的代码
  return gulp.src('./dist', {
      read: false
    })
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() { //拷贝源码
  return gulp.src('./www/**')
    .pipe(gulpCopy('./dist/', {
      prefix: 1
    }));
});

gulp.task('rjs', ['copy'], function(cb) { //rjs合并模块
  var rjs = spawn("r.js", ["-o", "build.js"], {
    cwd: process.cwd()
  })

  rjs.on('close', function(code) {

    console.log("Done with exit code", code);
    console.log("You access complete stdout and stderr from here"); // stdout, stderr
    cb()
  });
 

});

gulp.task('uglifyAll', ['rjs'], function() { //压缩合并js
  return gulp.src(['./dist/js/sui-require.js','./dist/js/**.js'])
    .pipe(concat('sui-requirejs.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
});

gulp.task('uglify', ['copy'], function() { //压缩js
  return gulp.src('./dist/js/**.js')
    /*.pipe(concat('sui-requirejs.js'))
    .pipe(gulp.dest('./dist/js'))*/
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
});



gulp.task('cssminAll', ['uglifyAll'], function(done) { //压缩合并css
  return gulp.src('./dist/css/*.css')
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('cssmin', ['copy'], function(done) { //只压缩不合并css
  return gulp.src('./dist/css/*.css')
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./dist/css'))
});


gulp.task('imageMin', ['copy'], function(done) { //压缩图片 .png

  return gulp.src('./dist/img/*.{jpg}')
    .pipe(imagemin({
      progressive: true,
      use: [jpegtran()]
    }))
    .pipe(gulp.dest('./dist/img'))

});

gulp.task('handlebars', function() { //根据模板生成html
  var templateData = {},
    options = {
      ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
      partials: {
        header: './www/template/header.handlebars',
        footer: './www/template/footer.handlebars'
      },
      batch: ['./www/template'],
      helpers: {
        capitals: function(str) {
          return str.toUpperCase();
        }
      }
    }

  return gulp.src('./www/template/**/*.html')
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest('./www/pages'));

});



gulp.task('watch', function() { //监听模板变化
  gulp.watch('./www/template/**/*', ['handlebars']);
});

gulp.task('runSequence', function(cb) {
  runSequence(['rev', 'imageMin'], 'revise','zip', cb);
});

gulp.task('runSequenceAll', function(cb) {
  runSequence(['revAll', 'imageMin'], 'revise','zip', cb);
});

gulp.task('rev', ['uglify', 'cssmin'], function() { //生成替换配置文件
  return gulp.src('./dist/{js,css}/**/*')
    .pipe(rev())
    .pipe(gulp.dest('./dist/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev'))
    .pipe(replace('.js', '')) //去除.js后缀名，因为requirejs
    .pipe(gulp.dest('dist/rev'));
});

gulp.task('revAll', ['uglifyAll'], function() { //生成替换配置文件
  return gulp.src('./dist/{js,css}/**/*')
    .pipe(rev())
    .pipe(gulp.dest('./dist/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/rev'))
    .pipe(replace('.js', '')) //去除.js后缀名，因为requirejs
    .pipe(gulp.dest('dist/rev'));
});

gulp.task('zip', function() { //压缩成zip
  return gulp.src(['./dist/**/*', '!./dist/node_modules/**/*','!**/server.js'])
    .pipe(zip('www.zip'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('revise', function() { //替换文件

  return gulp.src(['./dist/rev/*.json', './dist/**/*', '!./dist/template/**/*'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./dist'));

});

gulp.task('all', ['runSequenceAll']);
gulp.task('default', ['runSequence']);