function showDetailsForMap( id, pageNav ){
	var $container = $( "<div>" ).attr( "class", "container" );
	var $card = $( "#map" + id ).clone()
		.removeClass( "map-card" )
		.click( function(){
			showMap();
			selectMap( id );
		})
		.appendTo( $container )

	$( "p", $card )
		.html( "view map" );

	var $text = $( "<p>" )
		.html( maps[ id ].title + "<br>" + maps[ id ].author )
		.appendTo( $container );

	if ( !pageNav ){
		$( "#metadata > div" ).remove();
		$( "#metadata" ).append( $container );
		changeScreens( $("#category"), $( "#metadata" ) );
		$card.addClass( "animated bounceInDown" )
		addBreadcrumb( maps[ id ].title, "metadata" );
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
	$( "body" ).attr( "class", "metadata-screen" );		

	$( "#metadata h1" ).html( maps[ id ].title );

	$( "#page-buttons" ).show();
	$( "#page-buttons div" ).off( "click" );
	$( "#prev-page" ).on( "click", function(){
		var cat = categories[ maps[ id ].category ],
			index = cat.maps.indexOf( id );
		if ( index == 0 ) return;
		showDetailsForMap( cat.maps[ index - 1 ], "prev" );
	});
	$( "#next-page" ).on( "click", function(){
		var cat = categories[ maps[ id ].category ],
			index = cat.maps.indexOf( id );
		if ( index == cat.maps.length - 1 ) return;
		showDetailsForMap( cat.maps[ index + 1 ], "next" );
	});
}