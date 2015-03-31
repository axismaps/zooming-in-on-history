function showDetailsList( map_id ){
	var $panel = $( "#details-list" ).empty().show();
	$( "#detail-single" ).hide();
	var detailList = _.filter( details, function(d){ return d.map == map_id } );
	if ( detailList.length ){
		$( "#details-panel" ).attr( "class", "show" );
		$panel.append( "<h3>SELECT A MAP DETAIL:</h3>" );
		_.each( detailList, function(d){
			var container = $( "<div>" )
				.attr( "class", "detail" )
				.click( function(){
					showDetail( d );
				});
			$( "<div>" )
				.attr( "class", "detail-thumb" )
				.append( 
					$("<div><i class='fa fa-search-plus'></i></div>")
						.css( "background-color", categories[ selectedCategory ].color )
				)
				.appendTo( container );
			$( "<p>" )
				.html( d.title )
				.appendTo( container );

			$panel.append( container );
		});
	} else {
		$( "#details-panel" ).attr( "class", "hide" );
	}
}

function showDetail( d ){
	map.setView( [d.lat,d.lon], map.getMaxZoom() );
	$( "#details-list" ).hide();
	$( "#detail-single" ).show();

	$( "#detail-single img" ).remove();
	$( "#detail-single h3" ).html( d.title );
	$( "#detail-single p" ).html( d.caption );
	if ( d.image_num ) $( "#detail-single" ).append( "<img src='data/img/details/" + d.image_num + "'/>" );
}