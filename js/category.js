var selectedCategory,
	page,
	pageCount;

function selectCategory( id ){
	$( "body" ).attr( "class", "category-screen" );
	selectedCategory = id;
	$( "#category .title" ).html( categories[ id ].name );
	showMapsInCategory( id );
	changeScreens( $( "#home" ), $( "#category" ) );
	addBreadcrumb( $( "#category .title" ).text(), "category" );
}

function showMapsInCategory( id ){
	var $mapsDiv = $( "#map-cards" ).empty();

	var index = 0;
	pageCount = 0;
	
	_.each( maps, function( m, i ){
		if ( m.category != id ) return;
		if ( !categories[ id ].maps ) categories[ id ].maps = [];
		categories[ id ].maps.push( m.number );
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
			.appendTo( $div )
			.succinct({ size: 65 });
		$( ".map-card:last p" ).append( " <span>(" + m.date + ")</span>" );
		index++;
	});
	page = 1;
	$( "#page1" ).show();
	if ( pageCount > 1 ){
		$( "#page-buttons" ).show();
		$( "#page-buttons div" ).off( "click" );
		$( "#prev-page" ).on( "click", function(){
			showPage( page - 1 );
		});
		$( "#next-page" ).on( "click", function(){
			showPage( page + 1 );
		});
	}
}

function showPage( newPage ){
	if ( newPage < 1 || newPage > pageCount ) return;
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