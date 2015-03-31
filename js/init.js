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
			$( "#page-buttons" ).show();
			$( "#page-buttons div" ).off( "click" );
			$( "#prev-page" ).on( "click", function(){
				showPage( page - 1 );
			});
			$( "#next-page" ).on( "click", function(){
				showPage( page + 1 );
			});
		} else {
			$( "#page-buttons" ).hide();
		}
	} else if ( s == "metadata" ){
		$( "#page-buttons" ).show();
		$( "#page-buttons div" ).off( "click" );
		$( "#prev-page" ).on( "click", function(){
			var cat = categories[ selectedCategory ],
				index = cat.maps.indexOf( currentMap );
			if ( index == 0 ) return;
			showDetailsForMap( cat.maps[ index - 1 ], "prev" );
		});
		$( "#next-page" ).on( "click", function(){
			var cat = categories[ selectedCategory ],
				index = cat.maps.indexOf( currentMap );
			if ( index == cat.maps.length - 1 ) return;
			showDetailsForMap( cat.maps[ index + 1 ], "next" );
		});
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