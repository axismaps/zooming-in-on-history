var params = {};
var idleTimer = null,
	idleWait = 120000;

getURLParameters();
loadData();

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
	
	backButtonInit();
	
	$(window).resize( resize );
	resize();
	
	$( '.share' ).on( 'click', function() {
		$button = $( this );
		if( $( '.share-menu' ).is( ":visible" ) ) $( '.share-menu' ).hide();
		else {
			$( '.share-menu' ).show()
				.css( "top", $button.offset().top + $button.outerHeight() );
				
			if( $button.css( 'right' ) ) {
				$( '.share-menu' ).css( 'right', 0 );
			} else {
				$( '.share-menu' ).css( "left", $button.offset().left );
			}
		}
	});
}

	var category_hammer = new Hammer( $("#category")[0],{
		domEvents: true
	});
	category_hammer.on( "swipeleft", function(e){
		if ( $(e.target).hasClass("card") ) return;
		showPage( page + 1 );
		hideShowPageButton( page, pageCount);
	}).on( "swiperight", function(e){
		if ( $(e.target).hasClass("card") ) return;
		showPage( page - 1 );
		hideShowPageButton( page, pageCount);
	});

	var metadata_hammer = new Hammer( $("#metadata")[0] );
	metadata_hammer
	  .on( "swipeleft", nextMap )
	  .on( "swiperight", prevMap );

function resize(){
	$( '.share-menu' ).hide();
	var w = $(window).width(),
		h = $(window).height();
	$( '.page-button' ).css( 'top', Math.max( ( h - 460 ) / 2, 160 ) + 'px' );
	
	
	$( "#details-panel" )
		.height( h - $("#screen-top-border").height() - $("#breadcrumbs").height() )
		.css( "top", $("#screen-top-border").height() + $("#breadcrumbs").height() + "px" );
	$( "#interaction-elements" )
		.css( "top", $( "#screen-top-border" ).height() + $( "#breadcrumbs" ).height() + "px" )
		.css( "left", $( "#details-panel" ).width() )
		.css( "right", $( "#map #share-button" ).width() + 41 );
	$( "#map #share-button" )
		.css( "top", $( "#screen-top-border" ).height() + $( "#breadcrumbs" ).height() + "px" );

	$( "#metadata-button span" ).width( w - $("#home-button").outerWidth() - $("#category-button").outerWidth() - $("#map-button").outerWidth() - 150 );

	if ( $( ".map-cards-wrapper" ).length ){
		$( ".map-cards-wrapper" )
			.css({
				"max-width": Math.min( w - $( ".page-button" ).width() * 2 - 20, 1200 ) + "px",
				"max-height": h - $( "#map-cards" ).offset().top - $( ".footer" ).height() - 30 + "px"
			});
	}

	if ( $( "#metadata .container" )[0] ){
		$( "#metadata .container" ).width( w - $( ".page-button" ).width() - 20 )
			.css( "max-height", h - $( "#metadata .container" ).offset().top - 50 + "px" );
	}

	$( "body" ).width( w );
}

function getURLParameters(){
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	if ( params.categories ) params.categories = params.categories.split(",");
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
			categoryAnimation = setInterval( categorySlideshow, 5000 );
		}
		
		breadcrumbCSSUpdates();
		$( '.share-menu' ).hide();
		blockInteractions();
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

function blockInteractions(){
	$( "#mouse-block" ).show();
	setTimeout( function(){
		$( "#mouse-block" ).hide();
	}, 1000);
}
