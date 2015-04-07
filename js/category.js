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

	var index = 0;
	pageCount = 0;
	
	_.each( maps, function( m, i ){
		if ( m.category != id ) return;
		if ( !categories[ id ].maps ) categories[ id ].maps = [];
		categories[ id ].maps.push( m.number );
		if ( index % 8 == 0 ){
			pageCount ++;
			$( "<div>" )
				.attr( "class", "page" )
				.attr( "id", "page" + pageCount )
				.hide()
				.appendTo( $mapsDiv );
		}
		if ( index && index % 4 == 0 ) $( "#page" + pageCount ).append( "<br>" );
		var $div = $( "<div>" ).appendTo( "#page" + pageCount )
			.attr( "id", "map" + m.number )
			.addClass( "map-card card page" + pageCount + " pre-animated" + ( index % 4 + 1 ) )
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
    		}, index * 100 );
		}
		
		$( "<div><p>" + m.title + "</p></div>" )
			.css( "border-top-color", categories[ id ].color )
			.appendTo( $div )
			.succinct({ size: 65 });
		$( ".map-card:last p" ).append( " <span>(" + m.date + ")</span>" );
		index++;
	});
	page = 1;
	$( "#page1" ).show();
	pageButtonsForScreen( "category" );
	setMapTransitions();
	
	$( "#footer-category" ).css( 'margin-top', $( "#page1" ).height() + 'px' );
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

  var $maps = $( "#page" + page ).children();
  $maps.each( function( i, div ){
  		//Sets staggered start time for map panning animation
  		setTimeout( function() {
    		$( div ).attr( "class", $( div ).attr( "class" ).replace( "pre-animated", "map-animated" ) );
    }, 2000 + i * 1000 );
  })
}