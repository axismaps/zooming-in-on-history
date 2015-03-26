function showDetailsForMap( id ){
	$( "#metadata .card, #metadata > p" ).remove();
	changeScreens( $("#category"), $( "#metadata" ) );
	var $card = $( "#map" + id ).clone()
		.removeClass( "map-card" )
		.addClass( "animated bounceInDown" )
		.appendTo( "#metadata" )
		.click( function(){
			showMap();
			selectMap( id );
		});

	$( "p", $card ).html( "view map" );

	$( "<p>" )
		.html( maps[ id ].title + "<br>" + maps[ id ].author )
		.appendTo( "#metadata" );

	$( "#metadata h1" ).html( maps[ id ].title );
}