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

		$( "<div><p>" + cat.name + "</p></div>" )
			.css( "border-top-color", cat.color )
			.appendTo( $div );
	});	
}