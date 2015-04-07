var params = {};
var idleTimer = null,
	idleWait = 120000;

getURLParameters();
loadData();

//Prevent right-click context-menu
$( document ).bind( "contextmenu", function( e ) {
	e.preventDefault();
});

function initialize(){
	createCategories();
	createEvents();
	createMap();
	addBreadcrumb( 'Home', "home" );
	initTimer();
}

function createEvents(){
	$( ".screen" ).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$(this).removeClass( "fadeIn" );
	});
	$( "#detail-back" ).click( function(){
		showDetailsList( currentMap );
	})
	$(window).resize( resize );
	resize();
}

	var category_hammer = new Hammer( $("#category")[0] );
	category_hammer.on( "swipeleft", function(){
		showPage( page + 1 );
	}).on( "swiperight", function(){
		showPage( page - 1 );
	});

	var metadata_hammer = new Hammer( $("#metadata")[0] );
	metadata_hammer
	  .on( "swipeleft", nextMap )
		.on( "swiperight", prevMap );

function resize(){
	if ( $( '#category' ).is( ':visible' ) ){
		if ( $( 'body' ).width() > 1235 && $( '.page br' ).length == 0 ) {
			var length = $( '.card' ).length;
			$( '.card:nth-child(4)' ).after( '<br>' );
		} else if ( $( 'body' ).width() <= 1235 ){
			$( '.page br' ).remove();
		}
		$( "#footer-category" ).css( 'margin-top', $( "#page1" ).height() + 'px' );
	}
	
	
	$( "#details-panel" )
		.height( $(window).height() - $("#screen-top-border").height() - $("#breadcrumbs").height() )
		.css( "top", $("#screen-top-border").height() + $("#breadcrumbs").height() + "px" );
	$( "#interaction-elements" )
		.css( "top", $( "#screen-top-border" ).height() + $( "#breadcrumbs" ).height() + "px" )
		.css( "left", $( "#details-panel" ).width() );

	$( "#metadata-button span" ).width( $(window).width() - $("#home-button").outerWidth() - $("#category-button").outerWidth() - $("#map-button").outerWidth() - 150 );

	$( "body" ).width( $(window).width() );
}

function getURLParameters(){
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	// TO DO: make sure parameters are actually valid
	if ( !params.categories ) params.categories = "PR,BE";
	params.categories = params.categories.split(",");
}

function changeScreens( $from, $to, transitionOut, transitionIn ){
  transitionOut = transitionOut ? transitionOut : "fadeOut";
  transitionIn = transitionIn ? transitionIn : "fadeIn";
  
	$from.addClass( "animated " + transitionOut )
  setTimeout( function(){
    $( "body > .card" ).remove();
    $to.show().addClass( "animated " + transitionIn );
  }, 750 );
 	
  setTimeout( function(){
		$to.removeClass( "animated " + transitionIn );
		$from.removeClass( "animated " + transitionOut ).hide();
  }, 1500 );
}

function pageButtonsForScreen( s ){
	if ( s == "category" ){
		if ( pageCount > 1 ){
			$( ".page-button" ).show();
			$( ".page-button" ).off( "click" );
			$( "#prev-page" ).on( "click", function(){
				showPage( page - 1 );
				hideShowPageButton( page, pageCount);
			});
			$( "#next-page" ).on( "click", function(){
				showPage( page + 1 );
				hideShowPageButton( page, pageCount);
			});
			hideShowPageButton( page, pageCount);
		} else {
			$( ".page-button" ).hide();
		}
	} else if ( s == "metadata" ){
		$( ".page-button" ).show();
		$( ".page-button" ).off( "click" );
		$( "#prev-page" ).on( "click", prevMap );
		$( "#next-page" ).on( "click", nextMap );
		
		hideShowPageButton( categories[ selectedCategory ].maps.indexOf( currentMap ) + 1, categories[ selectedCategory ].maps.length );
	} else {
		$( ".page-button" ).hide();
	}
}

function hideShowPageButton( current, total) {
	$( '#prev-page' ).show();
	$( '#next-page' ).show();
	if ( current == 1 ) $( '#prev-page' ).hide();
	if ( current == total ) $( '#next-page' ).hide();
}

function addBreadcrumb( title, level ){
	var bc = $( '#breadcrumbs' ),
		id = '#' + level + '-button';
		
	bc.children( id ).css( 'display', 'inline-block' ).children( 'span' ).text( title );
	
	$( id ).on( 'click', function() {
		if( id != '#map-button' && $( this ).next( ':hidden' ).length == 0 ) {
			
			$( this ).nextAll().hide();
			$( '#geocoder-close-button' ).click();
			
			var current = $( "body" ).attr( "class" ).replace( "-screen", "" );
			changeScreens( $( "#" + current ), $( "#" + level ) );
			$( "body" ).attr( "class", level + "-screen" );
			
			pageButtonsForScreen( level );
		}
		
		if( id == '#home-button' ) {
			$( '#top-section' ).hide( [ 400 ] );
		}
		
		breadcrumbCSSUpdates();
	});

	$( "#metadata-button span" ).width( $(window).width() - $("#home-button").outerWidth() - $("#category-button").outerWidth() - $("#map-button").outerWidth() - 150 );
}

function sanitize( word ){
	return word.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();
}

function initTimer(){
	$( '*' ).bind( 'mousemove keydown scroll', function() {
		clearTimeout( idleTimer );
		
		idleTimer = setTimeout( function() {
			$( '#home-button' ).click();
		}, idleWait );
	});
	
	//starts the timer
	$( 'body' ).trigger( 'mousemove' );
}

function breadcrumbCSSUpdates(){
	$( '#breadcrumbs > div span.last, #breadcrumbs > div i.last' ).removeClass( 'last' );
	
	$( '#breadcrumbs > div:visible').last().children( 'span, i' ).addClass( 'last' );
}
