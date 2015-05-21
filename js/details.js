function showDetailsList( map_id, fulltext ){
	var $panel = $( "#details-list" ).empty().show();
	$( "#detail-single" ).hide();
	var detailList = _.filter( details, function(d){ return d.map == map_id } );
	if ( detailList.length ){
		if( $( window ).width() > 767 ) $( "#details-panel" ).show();
		if ( !fulltext ) $panel.append( "<h3>SELECT A MAP DETAIL:</h3>" );
		else $panel.append( "<h3>" + maps[ map_id ].title + "</h3>" );
		_.each( detailList, function(d){
			var container = $( "<div>" )
				.attr( "class", "detail" )
				.click( function(){
					if ( !fulltext ) showDetail( d );
				});
			$( "<div>" )
				.attr( "class", "detail-thumb" )
				.css( "background-image", "url(data/img/details/thumbnails/" + d.map_thumbnail + ")" )
				.append( 
					$("<div><i class='fa fa-search-plus'></i></div>")
						.css( "background-color", categories[ selectedCategory ].color )
				)
				.appendTo( container );
			var title = $( "<p>" )
				.html( d.title )
				.attr( "class", "detail-title" )

			if ( fulltext ){
				title.appendTo( container );
				$( "<p>" )
					.html( d.caption )
					.appendTo( container );
			} else {
				title.appendTo( container );
			}

			$panel.append( container );
		});
	} else {
		$( "#details-panel" ).hide();
	}
}

function showDetail( d ){
	map.setView( [ d.lat, d.lon ], d.zoom );
	$( "#details-list" ).attr( "class", "animated fadeOutLeft" );
	setTimeout( function(){
		$( "#details-list" ).hide().removeClass('animated fadeOutLeft' );
		$( "#detail-single" ).show().attr( "class", "animated fadeInRight" );
		setTimeout( function(){
			$( "#detail-single" ).removeClass('animated fadeInRight' );
		}, 1000 );
	}, 500 );
	
	$( "#detail-single h3" ).remove();
	$( "#detail-single p" ).remove();
	$( "<h3>" ).html( d.title ).appendTo( "#detail-single" );
	$( "<p>" ).html( d.caption ).appendTo( "#detail-single" );
	if ( d.image_num ) $( "#detail-single" ).append( "<p><img src='data/img/details/" + d.image_num + "'/></p>" );
}

function backButtonInit() {
	$( "#detail-back" ).click( function(){
		
		$( "#detail-single" ).attr( "class", "animated fadeOutRight" );
		setTimeout( function(){
			$( "#detail-single" ).hide().removeClass('animated fadeOutRight' );
			$( "#details-list" ).show().attr( "class", "animated fadeInLeft" );
			setTimeout( function(){
				$( "#details-list" ).removeClass('animated fadeInLeft' );
			}, 1000 );
		}, 500 );
	})
}