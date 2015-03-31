function showDetailsList( map_id ){
	var $panel = $( "#details-list" ).empty().show();
	$( "#detail-single" ).hide();
	var detailList = _.filter( details, function(d){ return d.map == map_id } );
	if ( detailList.length ){
		$( "#details-panel" ).attr( "class", "show" );
		_.each( detailList, function(d){
			var container = $( "<div>" )
				.attr( "class", "detail" )
				.click( function(){
					showDetail( d );
				});
			$( "<div>" )
				.attr( "class", "detail-thumb" )
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
	if ( d.image_num ) $( "#detail-single" ).append( "<img src='data/img/" + d.image_num + "'/>" );
}