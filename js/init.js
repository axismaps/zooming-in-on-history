var params = {};
var selectedCategory;
var page,
	pageCount;
var url = '';

getURLParameters();
loadData();

function initialize(){
	if( params.mapId ) {
		goToMap( params.mapId )
	}
	createCategories();
	createEvents();
	createMap();
	addBreadcrumb( 'Home', "home" );
}

function createEvents(){
	$( ".screen" ).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$(this).removeClass( "fadeIn" );
	});
	
	backButtonInit();
	
	$(window).resize( resize );
	resize();
	
	//Share button clicking anywhere on the site
	$( '.share' ).on( 'click', function(e) {
		e.stopPropagation();
		$button = $( this );
		if( $( '.share-menu' ).is( ":visible" ) ) hideShare();
		else {
			$( '.share-menu' ).show();
			
			if( $( window ).width() > 767 ) {
				$( '.share-menu' )
					.css( "top", $button.offset().top + $button.outerHeight() );
					
				if( $button.css( 'right' ) != 'auto' ) {
					$( '.share-menu' ).css( 'right', 0 ).css( 'left', 'auto');
				} else {
					$( '.share-menu' ).css( "left", $button.offset().left ).css( 'right', 'auto' );
				}

				$( 'body' ).on( 'click', hideShare );
			}
		}
	});
	
	$( '#share-close' ).on( 'click', function() {
		hideShare();
	});

	function hideShare(e){
		if ( e && e.target ){
			var share = $( '.share-menu' )[0],
				$target = $( e.target );
			// do not hide if target is the menu
			if ( e.target == share || $.contains( share, e.target ) ){
				if ( !$target.hasClass( "social-media" ) && !$target.parent().hasClass( "social-media" ) )
					return;
			}
		}
		$( '.share-menu' ).hide();
		$( 'body' ).off( 'click', hideShare );
	}
}

	var category_hammer = new Hammer( $("#category")[0],{
		domEvents: true
	});
	category_hammer.on( "swipeleft", function(e){
		if ( $(e.target).hasClass("card") || $( window ).width() <= 767 ) return;
		showPage( page + 1 );
		hideShowPageButton( page, pageCount);
	}).on( "swiperight", function(e){
		if ( $(e.target).hasClass("card")  || $( window ).width() <= 767 ) return;
		showPage( page - 1 );
		hideShowPageButton( page, pageCount);
	});

	var metadata_hammer = new Hammer( $("#metadata")[0] );
	metadata_hammer
	  .on( "swipeleft", nextMap )
	  .on( "swiperight", prevMap );

function resize(){
	var w = $(window).width(),
		h = $(window).height();
	$( '.page-button' ).css( 'top', Math.max( ( h - 460 ) / 2, 160 ) + 'px' );
	
	
	if( $( window ).width() > 767 ) {
		$( "#details-panel" )
			.height( h - $("#screen-top-border").height() - $("#breadcrumbs").height() )
			.css( "top", $("#screen-top-border").height() + $("#breadcrumbs").height() + "px" );
	}
		
	$( "#interaction-elements" )
		.css( "top", $( "#screen-top-border" ).height() + $( "#breadcrumbs" ).height() + "px" )
		.css( "left", $( "#details-panel" ).width() )
		.css( "right", $( "#map-share-button" ).width() + 41 );
	$( "#map-share-button" )
		.css( "top", $( "#screen-top-border" ).height() + $( "#breadcrumbs" ).height() + "px" );

	if( $( window ).width() > 767 ) $( "#metadata-button span" ).width( w - $("#home-button").outerWidth() - $("#category-button").outerWidth() - $("#map-button").outerWidth() - 150 );
	$( ".meta-text" ).css( "max-width", w - 645 + "px" );

	if ( $( "#home #categories" ).length ){
		$( "#home #categories" )
			.css({
				"max-height": h - $( "#home #categories" ).offset().top - $( ".footer" ).height() - 30 + "px"
			});
	}
	
	if ( $( ".map-cards-wrapper" ).length ){
		$( ".map-cards-wrapper" )
			.css({
				"max-width": Math.min( w - $( ".page-button" ).width() * 2 - 20, 1200 ) + "px",
				"max-height": h - $( "#map-cards" ).offset().top - $( ".footer" ).height() - 30 + "px"
			});
	}

	if ( $( "#metadata .container" ).length ){
		$( "#metadata .container" ).width( w - $( ".page-button" ).width() - 20 )
			.css( "max-height", h - $( "#metadata .container" ).offset().top - $( ".footer" ).height() - 30 + "px" );
	}

	$( "body" ).width( w );
}

function getURLParameters(){
	url = location.origin + location.pathname;
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	if ( params.categories ) params.categories = params.categories.split(",");
}

function goToMap( id ) {
	var id = params.mapId;
		selectedCategory = maps[ id ].category;
		
	//home screen transitions
	clearInterval( categoryAnimation );
	$( "#home" ).hide();
	
	showMapsInCategory( selectedCategory );
	$( "#category .title" ).html( categories[ selectedCategory ].name );
	showDetailsForMap( id, false, true );
	$( "#metadata" ).hide();
	var indexInCategory = categories[ selectedCategory ].maps.indexOf( id );
	page = parseInt( indexInCategory / 8 ) + 1;
	$( '#page1' ).hide();
	showPage( page );
	
	//map screen transitions
	$( '#top-section' ).show().children( '#screen-top-border' ).css( "background-color", categories[ selectedCategory ].color );
	$( "#map" ).fadeIn( function() {
		addBreadcrumb( categories[ selectedCategory ].name, "category" );
		addBreadcrumb(  maps[ id ].title, "metadata" );
		showMap();
		selectMap( id );
		showDetailsList( id );
		breadcrumbCSSUpdates();
		blockInteractions();
	});
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

function hideShowPageButton( current, total ) {
	$( '#prev-page' ).show();
	$( '#next-page' ).show();
	if ( current == 1 ) $( '#prev-page' ).hide();
	if ( current == total ) $( '#next-page' ).hide();
}

function addBreadcrumb( title, level ){
	var bc = $( '#breadcrumbs' ),
		id = '#' + level + '-button';
  
    $( ".breadcrumb-back" ).removeClass( "breadcrumb-back" );
	bc.children( id ).css( 'display', 'inline-block' );
	bc.children( id ).children( 'span:not(.mobile)' ).text( title );
    bc.children( id ).prev().addClass( "breadcrumb-back" );
	
	$( id ).on( 'click', function() {
		if( id != '#map-button' &&
			$( this ).attr( "id" ).replace("-button","") != $( "body" ).attr( "class" ).replace("-screen","") ) {
			
			$( this ).nextAll().hide();
			$( '#geocoder-close-button' ).click();
			$( '#details-close' ).click();
			
			var current = $( "body" ).attr( "class" ).replace( "-screen", "" );
			changeScreens( $( "#" + current ), $( "#" + level ) );
			$( "body" ).attr( "class", level + "-screen" );
			
			pageButtonsForScreen( level );
			
			$( ".breadcrumb-back" ).prev().addClass( "breadcrumb-back" ).next().removeClass( "breadcrumb-back" );
		}
		
		if( id == '#home-button' ) {
			$( '#top-section' ).hide( [ 400 ] );
			setTimeout( function() {
				resize();
			}, 1000 );
			categoryAnimation = setInterval( categorySlideshow, 5000 );
		}
		
		breadcrumbCSSUpdates();
		$( '.share-menu' ).hide();
		blockInteractions();
	});

	if( $( window ).width() > 767 ) $( "#metadata-button span" ).width( $(window).width() - $("#home-button").outerWidth() - $("#category-button").outerWidth() - $("#map-button").outerWidth() - 150 );
}

function sanitize( word ){
	return word.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();
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
