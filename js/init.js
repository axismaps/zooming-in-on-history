var params = {};

getURLParameters();
loadData();

function initialize(){
	createCategories();
	createEvents();
	createMap();
	addBreadcrumb( 'Home', "home" );
}

function createEvents(){
	$( ".screen" ).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$(this).removeClass( "fadeIn" );
	});

	var category_hammer = new Hammer( $("#category")[0] );
	category_hammer.on( "swipeleft", function(){
		showPage( page + 1 );
	}).on( "swiperight", function(){
		showPage( page - 1 );
	});

	var metadata_hammer = new Hammer( $("#metadata")[0] );
	metadata_hammer.on( "swipeleft", nextMap )
		.on( "swiperight", prevMap );
}

function getURLParameters(){
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	// TO DO: make sure parameters are actually valid
	if ( !params.categories ) params.categories = "PR,BE";
	params.categories = params.categories.split(",");
}

function changeScreens( $from, $to ){
	$from.addClass( "animated fadeOut" );
	$to.show().removeClass( "fadeOut" ).addClass( "animated fadeIn" );
	setTimeout( function(){
		$from.hide();
	},1000);
}

function pageButtonsForScreen( s ){
	if ( s == "home" )
		$( "#page-buttons" ).hide();
	else if ( s == "category" ){
		if ( pageCount > 1 ){
			$( ".page-button" ).show();
			$( ".page-button" ).off( "click" );
			$( ".page-button" ).on( "click", function(){
				showPage( page - 1 );
			});
			$( "#next-page" ).on( "click", function(){
				showPage( page + 1 );
			});
		} else {
			$( ".page-button" ).hide();
		}
	} else if ( s == "metadata" ){
		$( ".page-button" ).show();
		$( ".page-button" ).off( "click" );
		$( "#prev-page" ).on( "click", prevMap );
		$( "#next-page" ).on( "click", nextMap );
	}
}

function addBreadcrumb( title, level ){
	var bc = $( '#breadcrumbs' ),
		id = '#' + level + '-button';
		
	bc.children( id ).css( 'display', 'inline-block' ).children( 'span' ).text( title ).succinct({ size: 70 });
	
	$( id ).on( 'click', function() {
		if( id != '#map-button' && $( this ).next( ':hidden' ).length == 0 ) {
			
			$( this ).nextAll().hide();
			
			var current = $( "body" ).attr( "class" ).replace( "-screen", "" );
			changeScreens( $( "#" + current ), $( "#" + level ) );
			$( "body" ).attr( "class", level + "-screen" );
			
			pageButtonsForScreen( level );
		}
	});
}

function sanitize( word ){
	return word.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();
}