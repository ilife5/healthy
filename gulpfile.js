var gulp = require('gulp');
var rev = require('gulp-rev');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var revReplace = require('gulp-rev-replace');

gulp.task("prd", ["imgMin", "prd_js"]);

gulp.task("imgMin", function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('public/images'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest('./')); // write manifest to build dir
});

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task("prd_js", ['lint'], function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('public'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task("prd_html", ["imgMin", "prd_js"], function() {
    var manifest = gulp.src("public/assets/rev-manifest.json");

    return gulp.src("src/*.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest("public"));
});