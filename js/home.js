function createCategories(){
	var $categoriesDiv = $( "#categories" );
	
	_.each( categories, function( cat, i ){
		if ( params.categories.indexOf( cat.id ) == -1 ) return;	// somehow this needs to know which categories to show
		var $div = $( "<div>" ).appendTo( $categoriesDiv )
			.attr( "class", "category card " + cat.id  )
			.attr( "id", cat.id )
			.click( function(){
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
			.css( "border-top-color", cat.color )
			.appendTo( $div );
	});	
	
	setInterval( categorySlideshow, 1000 );
}

function categorySlideshow(){
  $( ".category.card" ).each( function() {
    console.log( "THUS" );
    if( $( this ).children( ".map-background.slideLeft" ).length == 0 ) {
      $( this ).children( ".map-background" ).last().addClass( "slideLeft" );
    }
    else if( $( this ).children( ".map-background.slideLeft" ).length < $( this ).children( ".map-background" ).length ) {
      $( this ).children( ".map-background.slideLeft" ).prev().addClass( "slideLeft" );
    }
    else {
      $( this ).children( ".map-background.slideLeft" ).removeClass( "slideLeft" );
    }
  })
}