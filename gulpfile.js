//Minifierar alla bilder. Blev dock endast runt 0.8% mindre..
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
 
function imgSquash() {
    return gulp .src("./public/Images/*")
    .pipe(imagemin()) 
    .pipe(gulp.dest("./public/minified/Images"));
   }

   gulp.task("imgSquash", imgSquash);

   gulp.task("watch", () => { 
    gulp.watch("./public/Images/*", imgSquash);
   });

   gulp.task("default",gulp.series("imgSquash","watch"));