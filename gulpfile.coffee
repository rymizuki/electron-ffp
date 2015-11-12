gulp = require('gulp')

gulp.task 'view', ->
  webpackStream = require('webpack-stream')
  gulp.src('view')
    .pipe webpackStream(require('./webpack.conf'))
    .pipe gulp.dest('lib/')

gulp.task 'watch', ->
  gulp.watch [ 'view/*', 'view/**/*' ], ['view']
