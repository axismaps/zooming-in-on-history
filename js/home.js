var categoryAnimation;

function createCategories(){
	var $categoriesDiv = $( "#categories" );
	
	_.each( categories, function( cat, i ){
		if ( params.categories && params.categories.indexOf( cat.id ) == -1 ) return;	// somehow this needs to know which categories to show
		var $div = $( "<div>" ).appendTo( $categoriesDiv )
			.attr( "class", "category card " + cat.id  )
			.attr( "id", cat.id )
			.click( function(){
  			  clearInterval( categoryAnimation );
  			  $( this )
  			    .addClass( "animated bounceOut" )
          .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $( "#home" ).hide();
            $( this ).removeClass( "animated bounceOut" );
            selectCategory( cat.id );
          })
			});
			
		var categoryMaps = _.pluck( _.filter( maps, function( map ) { return map.category == cat.id } ), 'number' );
		
    _.each( categoryMaps, function( mapId, i ){
      $mapBack = $( "<div>" )
          .css( "background-image", "url(data/img/thumbnails/" + mapId + ".jpg)" )
          .addClass( "map-background" )
          .appendTo( $div );
    });

		$( "<div><p>" + cat.name + "</p></div>" )
		  .addClass( "category-title" )
			.css( "border-top-color", cat.color )
			.appendTo( $div );
	});	
	
	$( "#categories" ).css( 'height', $( window ).height() - 132 );
	categorySlideshow();
	categoryAnimation = setInterval( categorySlideshow, 6000 );
}

function categorySlideshow(){
  $( ".category.card" ).each( function( i ) {
    var $slide = $( this ).children( ".map-background" ).first();
    $slide.attr( "style", $slide.attr( "style" ).replace( "left: -425px; opacity: 1;", "" ) );
    $( this ).children( ".category-title" ).before( $slide );
    
    setTimeout( function() {
      $slide.animate( { left: -425, opacity: 1 }, 5000 );
    }, i * 2000 );
  })
}