function showDetailsList( map_id ){
	var $panel = $( "#details-panel" );
	$panel.empty();
	var detailList = _.filter( details, function(d){ return d.map == map_id } );
	if ( detailList.length ){
		$panel.attr( "class", "show" );
		_.each( detailList, function(d){
			var container = $( "<div>" )
				.attr( "class", "detail" )
				.click( function(){
					map.setView( [d.lat,d.lon], map.getMaxZoom() )
				});
			$( "<div>" )
				.attr( "class", "detail-thumb" )
				.css( "background-image", "url(data/img/" + d.image_num + ")")
				.appendTo( container );
			$( "<p>" )
				.html( d.title )
				.appendTo( container );

			$panel.append( container );
		});
	} else {
		$panel.attr( "class", "hide" );
	}
}