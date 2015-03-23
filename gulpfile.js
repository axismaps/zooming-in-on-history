var gulp = require( 'gulp' ),
	usemin = require( 'gulp-usemin' ),
	uglify = require( 'gulp-uglify' ),
	minifyCss = require( 'gulp-minify-css' ),
	del = require( 'del' );

gulp.task( 'default', [ 'clean' ], function(){
	gulp.src( 'index.html' )
		.pipe( usemin({
			assetsDir : '',
			css : [ minifyCss(), 'concat' ],
			js : [ uglify(), 'concat' ]
		}))
		.pipe( gulp.dest( 'public/' ) )

	gulp.src( 'img/*' )
		.pipe( gulp.dest( 'public/img' ) );
});

gulp.task( 'clean', function( callback ){
    del( [ 'public/css', 'public/img', 'public/js', 'public/index.html' ], callback );
});
