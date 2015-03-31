function showDetailsList( map_id ){
	var detailList = _.filter( details, function(d){ return d.map == map_id } );
	if ( detailList.length ){
		$( "#details-panel" ).attr( "class", "show" );
	} else {
		$( "#details-panel" ).attr( "class", "hide" );
	}
}