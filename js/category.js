var selectedCategory,
	page,
	pageCount;

function selectCategory( id ){
	$( "body" ).attr( "class", "category-screen" );
	$( "#category" ).show();
	selectedCategory = id;
	$( "#category .title" ).html( categories[ id ].name );
	showMapsInCategory( id );
	addBreadcrumb( $( "#category .title" ).text(), "category" );
	$( '#top-section' ).show( [ 400 ] ).children( '#screen-top-border' ).css( "background-color", categories[id].color );
	breadcrumbCSSUpdates();

	// this should be done more generically for lots of UI elements
	$( "#detail-back" ).css( "background-color", categories[id].color );
}

function showMapsInCategory( id ){
	var $mapsDiv = $( "#map-cards" ).empty();

	pageCount = 0;

	var mapsInCategory = _.sortBy ( _.filter( maps, function(m){ return m.category == id } ), function(m){ return parseInt(m.number) } );
	_.each( mapsInCategory, function( m, i ){
		if ( !categories[ id ].maps ) categories[ id ].maps = [];
		categories[ id ].maps.push( m.number );
		if ( i % 8 == 0 ){
			pageCount ++;
			$( "<div>" )
				.attr( "class", "page" )
				.attr( "id", "page" + pageCount )
				.hide()
				.appendTo( $mapsDiv );
			$( "<div>" )
				.attr( "class", "map-cards-wrapper")
				.appendTo( $( '#page' + pageCount ) );
		}
		var $div = $( "<div>" ).appendTo( "#page" + pageCount + " .map-cards-wrapper" )
			.attr( "id", "map" + m.number )
			.addClass( "map-card card page" + pageCount + " pre-animated" + ( i % 4 + 1 ) )
			.css( "background-image", "url( data/img/thumbnails/" + m.number + ".jpg )" )
			.click( function(){
				showDetailsForMap( m.number );
				breadcrumbCSSUpdates();
			});
		
		//Sets bounce in transition only for the first page
		if( pageCount == 1 ) {
  		  $div.css( "opacity", 0 );
    		setTimeout( function() {
    		  $div
    		    .css( "opacity", 1 )
    		    .addClass( "animated bounceIn" );
    		  setTimeout( function(){
      		  $div.removeClass( "animated bounceIn" );
      		}, 1000 );
    		}, i * 100 );
		}
		
		$( "<div><p>" + m.title + "</p></div>" )
			.css( "border-top-color", categories[ id ].color )
			.appendTo( $div )
			.succinct({ size: 45 });
		$( ".map-card:last p" ).append( " <span>(" + m.date + ")</span>" );

		var card_hammer = new Hammer( $div[0],{
			domEvents: true
		});
		card_hammer.on( "swipeleft", function(e){
			showPage( page + 1 );
			hideShowPageButton( page, pageCount);
		}).on( "swiperight", function(){
			showPage( page - 1 );
			hideShowPageButton( page, pageCount);
		});
	});
	page = 1;
	$( "#page1" ).show();
	pageButtonsForScreen( "category" );
	setMapTransitions();

	resize();
}

function showPage( newPage ){
	if ( newPage < 1 || newPage > pageCount ) return;
	var inAnim, outAnim;
	if ( newPage > page ){
		inAnim = "fadeInRight";
		outAnim = "fadeOutLeft";
	} else {
		inAnim = "fadeInLeft";
		outAnim = "fadeOutRight";
	}
	$( "#page" + page ).attr("class", "page animated " + outAnim );
	$( "#page" + newPage ).show().attr("class", "page animated " + inAnim );
	page = newPage;
	setMapTransitions();
}

function setMapTransitions(){
  $( ".map-card" ).each( function(){
    $( this ).attr( "class", $( this ).attr( "class" ).replace( "map-animated", "pre-animated" ) );
  });

  var $maps = $( "#page" + page + " .map-cards-wrapper").children();
  $maps.each( function( i, div ){
  		//Sets staggered start time for map panning animation
  		setTimeout( function() {
    		$( div ).attr( "class", $( div ).attr( "class" ).replace( "pre-animated", "map-animated" ) );
    }, 2000 + i * 1000 );
  })
}