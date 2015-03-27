var map,
	modernTiles,
	historicTiles;
function createMap(){
	map = L.map( "mapdiv" ).setView( [40,-80], 5 );
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" ).addTo(map);
}

function selectMap( id ){
	if ( historicTiles ) map.removeLayer( historicTiles );
	
	var mapData = maps[ id ];
	var bounds = [ 
		[mapData.bottom, mapData.left],
		[mapData.top, mapData.right]
	];
	map.setMaxBounds( bounds );
	map.fitBounds( bounds );
	
	historicTiles = L.tileLayer( "tiles/" + id + "/{z}/{x}/{y}.png", {
		tms:true,
		bounds: bounds
	} ).addTo(map);
	
	map.options.maxZoom = ( mapData.MaxZoom );
	map.options.minZoom = ( mapData.MinZoom );
}

function showMap(){
	changeScreens( $( "#metadata" ), $( "#map" ) );
	map.invalidateSize();
	$( "body" ).attr( "class", "map-screen" );
	$( "#page-buttons" ).hide();
}