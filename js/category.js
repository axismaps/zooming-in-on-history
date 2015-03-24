var selectedCategory;

function selectCategory( id ){
	$( "body" ).attr( "class", "category-screen " + id );
	selectedCategory = id;
	showMapsInCategory( id );
}

function showMapsInCategory( id ){
	var $mapsDiv = $( "#map-cards" ).empty();
	
	maps.data.forEach( function( m, i ){
		if ( m.category != id ) return;
		var $div = $( "<div>" ).appendTo( $mapsDiv )
			.attr( "class", "map-card card" )
			.attr( "id", "map" + m.number )
		$( "<div><p>" + m.title + "</p></div>" )
			.css( "border-top-color", colors[i] )
			.appendTo( $div );
	});
}