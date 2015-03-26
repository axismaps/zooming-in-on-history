var selectedCategory,
	page;

function selectCategory( id ){
	$( "body" ).attr( "class", "category-screen " + id );
	selectedCategory = id;
	showMapsInCategory( id );
	$( "#home" ).addClass( "animated fadeOut" );
	$( "#category" ).show().removeClass( "fadeOut" ).addClass( "animated fadeIn" );
}

function showMapsInCategory( id ){
	var $mapsDiv = $( "#map-cards" ).empty();

	var index = 0,
		pageCount = 0;
	
	_.each( maps, function( m, i ){
		if ( m.category != id ) return;
		if ( index % 8 == 0 ){
			pageCount ++;
			$( "<div>" )
				.attr( "class", "page" )
				.attr( "id", "page" + pageCount )
				.hide()
				.appendTo( $mapsDiv );
		} 
		var $div = $( "<div>" ).appendTo( "#page" + pageCount )
			.attr( "class", "map-card card page" + pageCount )
			.attr( "id", "map" + m.number )
			.click( function(){
				showDetailsForMap( m.number );
			})

		$( "<div><p>" + m.title + "</p></div>" )
			.css( "border-top-color", colors[i] )
			.appendTo( $div );
		index++;
	});
	page = 1;
	$( "#page1" ).show();
}

function showPage( newPage ){
	var inAnim, outAnim;
	if ( newPage > page ){
		inAnim = "fadeInRight";
		outAnim = "fadeOutLeft";
	} else {
		inAnim = "fadeInLeft";
		outAnim = "fadeOutRight";
	}
	$( "#page" + page ).attr("class", "page animated " + outAnim );
	$( "#page" + newPage ).show().attr("class", "page animated " + inAnim );
	page = newPage;
}