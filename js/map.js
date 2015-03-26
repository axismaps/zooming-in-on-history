var map,
	modernTiles,
	historicTiles;
function createMap(){
	map = L.map( "mapdiv" ).setView( [40,-80], 5 );
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" ).addTo(map);
}

function selectMap( id ){
	if ( historicTiles ) map.removeLayer( historicTiles );
	historicTiles = L.tileLayer( "tiles/" + id + "/{z}/{x}/{y}.png", {tms:true} ).addTo(map);
	var mapData = maps[ id ];
	var bounds = [ 
		[mapData.bottom, mapData.left],
		[mapData.top, mapData.right]
	];
	map.fitBounds( bounds );
}

function showMap(){
	$( ".screen" ).hide();
	$( "#map" ).show();
	map.invalidateSize();
}