var currentMap;

function showDetailsForMap( id, pageNav ){
	currentMap = id;
	var $container = $( "<div>" ).attr( "class", "container" );
	
	$( "body > .card" ).remove();
	var $card = $( "#map" + id ).clone();
	$card.children().hide();
	$card
	  .removeClass( "animated bounceIn" )
		.click( function(){
  		  $( "#metadata" ).fadeOut( function() {
    		  $( "#map" ).fadeIn( function() {
      		  showMap();
          selectMap( id );
        });
  		  });
		})
		.css({
  		  position : "fixed",
  		  top : $( "#map" + id ).offset().top,
  		  left : $( "#map" + id ).offset().left
		})
		.appendTo( $( "body" ) );

	var $text = $( "<p>" )
		.html( maps[ id ].title + "<br><br><span class='author'>" + maps[ id ].author + ", " + maps[ id ].date + "</span><br><span class='dimensions'>" + maps[ id ].dimension + "</span>" )
		.appendTo( $container );

	if ( !pageNav ){
		$( "#metadata > div:not(.footer)" ).remove();
		$( "#metadata" ).append( $container );
		$("#category").fadeOut( function(){
  		  $( "#metadata" ).fadeIn( function(){
    		  $card
    		    .removeClass( "map-card" )
    		    .addClass( "fixed" );
    		  
    		  setTimeout( function() {
      		  $( "p", $card ).html( "<i class='fa fa-search-plus'></i> View the Map" );
      		  if ( maps[ id ].courtesy ) $( "div", $card ).append( "<p class='courtesy'>Courtesy of " + maps[ id ].courtesy + "<p>" );
      		  $card.children().fadeIn();
      		  $( "#metadata .container" ).prepend( $card );
      		  $card.css({
        		  top : "auto",
        		  left : "auto"
      		  });
      		}, 1000 );
    		});
  		});
		
	} else {
		var $old = $( "#metadata > div:not(.footer)" );
		$card.removeClass( "map-card" );
		$container
			.append( $card )
			.append( $text )
			.appendTo( "#metadata" );
		setTimeout( function(){
			$old.remove();
			$( "p", $card ).html( "<i class='fa fa-search-plus'></i> View the Map" );
			if ( maps[ id ].courtesy ) $( "div", $card ).append( "<p class='courtesy'>Courtesy of " + maps[ id ].courtesy + "<p>" );
      $card.children().fadeIn();
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

	$( "#metadata h1" ).html( maps[ id ].title ).succinct({ size: 40 });
	$( "#metadata h1" ).append( ' (' + maps[ id ].date + ')' );
	
	$( "#footer-metadata" ).css( 'margin-top', $( ".card" ).height() + 'px' );

	pageButtonsForScreen( "metadata" );
}

function nextMap(){
	var cat = categories[ selectedCategory ],
		index = cat.maps.indexOf( currentMap );
	if ( index == cat.maps.length - 1 ) return;
	showDetailsForMap( cat.maps[ index + 1 ], "next" );
}

function prevMap(){
	var cat = categories[ selectedCategory ],
		index = cat.maps.indexOf( currentMap );
	if ( index == 0 ) return;
	showDetailsForMap( cat.maps[ index - 1 ], "prev" );
}