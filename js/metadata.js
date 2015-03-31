var currentMap;

function showDetailsForMap( id, pageNav ){
	currentMap = id;
	var $container = $( "<div>" ).attr( "class", "container" );
	var $card = $( "#map" + id ).clone()
		.removeClass( "map-card" )
		.click( function(){
			showMap();
			selectMap( id );
		})
		.appendTo( $container );

	$( "p", $card )
		.html( "<i class='fa fa-search-plus'></i> View the Map" );

	var $text = $( "<p>" )
		.html( maps[ id ].title + "<br>" + maps[ id ].author )
		.appendTo( $container );

	if ( !pageNav ){
		$( "#metadata > div" ).remove();
		$( "#metadata" ).append( $container );
		changeScreens( $("#category"), $( "#metadata" ) );
		$card.addClass( "animated bounceInDown" )
	} else {
		var $old = $( "#metadata > div" );
		$container
			.append( $card )
			.append( $text )
			.appendTo( "#metadata" );
		setTimeout( function(){
			$old.remove();
		},1000);
		if ( pageNav == "next" ){
			$old.addClass( "animated fadeOutLeft" );
			$container.addClass( "animated fadeInRight" );
		} else {
			$old.addClass( "animated fadeOutRight" );
			$container.addClass( "animated fadeInLeft" );
		}
	}
	addBreadcrumb( maps[ id ].title, "metadata" );
	$( "body" ).attr( "class", "metadata-screen" );		

	$( "#metadata h1" ).html( maps[ id ].title ).succinct({ size: 50 });
	$( "#metadata h1" ).append( ' (' + maps[ id ].date + ')' );

	pageButtonsForScreen( "metadata" );
}