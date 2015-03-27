var map,
	modernTiles,
	historicTiles;
function createMap(){
	map = L.map( "mapdiv" ).setView( [40,-80], 5 );
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" , { maxNativeZoom : 18, maxZoom : 21 }).addTo(map);
}

function selectMap( id ){
	if ( historicTiles ) map.removeLayer( historicTiles );
	
	var mapData = maps[ id ];
	var bounds = [ 
		[mapData.bottom, mapData.left],
		[mapData.top, mapData.right]
	];
	map.setMaxBounds( bounds );
	map.options.maxZoom = ( mapData.MaxZoom );
	map.options.minZoom = ( mapData.MinZoom );
	
	historicTiles = L.tileLayer( "tiles/" + id + "/{z}/{x}/{y}.png", {
		tms : true,
		bounds : bounds,
		maxZoom : mapData.MaxZoom,
		maxNativeZoom : mapData.MaxZoom
	} ).addTo(map);
	
	map.fitBounds( bounds );
}

function showMap(){
	changeScreens( $( "#metadata" ), $( "#map" ) );
	map.invalidateSize();
	$( "body" ).attr( "class", "map-screen" );
	$( "#page-buttons" ).hide();
	
	geocoder();
}

function geocoder(){
	$( '#geocode-submit' ).on( 'click', function( e ) {
		e.preventDefault();
		var geocodeValue = $( '#geocode-input' ).val();
				
		MQ.geocode({ map: map }).search( geocodeValue )
			.on( 'success', function( e ){
				var result;
				
				$.map( e.result.matches, function( v, i ){
					if( historicTiles.options.bounds.contains( v.latlng ) ) {
						result = v;
					}
				});
				
				if( result ) {
					var latlng = result.latlng;
					
					map.setView( latlng, 16 );
					
					L.marker( [ latlng.lat, latlng.lng ] )
						.addTo( map )
						.bindPopup( '<strong>' + geocodeValue + '</strong><br />is located here.' )
						.openPopup();
				} else {
					console.log( 'Nothing found' );
				}
			});
	});
	
	$( '#geocode-input' ).keyup( function( e ) {
		if( e.keyCode === 13) {
			$( '#geocode-submit' ).click();
			$( this ).blur();
		}
	});
}