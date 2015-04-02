var map,
	modernTiles,
	geocodeResultLayer,
	historicTiles;
function createMap(){
	map = L.map( "mapdiv" ).setView( [40,-80], 5 );
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" , { maxNativeZoom : 18, maxZoom : 21 }).addTo(map);
	geocodeResultLayer = L.layerGroup().addTo(map);
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
	
	map.fitBounds( bounds, {animate: false} );

	$( "#reset-map" ).hide();

	showDetailsList( id );

	pageButtonsForScreen( "map" );

	map.on( "movestart", onMapMove );

	$( "#reset-map" ).click( function(){
		map.off( "movestart", onMapMove )
			.fitBounds( bounds );
		setTimeout( function(){
			$( "#reset-map" ).hide();
			map.on( "movestart", onMapMove );
		},750);
	})
}

function onMapMove(){
	$( "#reset-map" ).show();
}

function showMap(){
	changeScreens( $( "#metadata" ), $( "#map" ) );
	addBreadcrumb( 'Map Viewer', 'map' );
	map.invalidateSize();
	$( "body" ).attr( "class", "map-screen" );
	$( "#page-buttons" ).hide();
	
	geocoder();
	slider_init();
}

function geocoder(){
	$( '#find-your-city-button, #geocode-submit, #geocoder-close-button' ).css( "background-color", categories[ selectedCategory ].color );
	
	$( '#find-your-city-button' ).on( 'click', function( e ) {
		e.preventDefault();
		$( this ).hide();
		$( '#transparency-div' ).hide();
		$( '#geocode' ).show();
		$( '#geocoder-close-button' ).show();
	});
	
	$( '#geocoder-close-button' ).on( 'click', function( e ) {
		e.preventDefault();
		$( this ).hide();
		$( '#transparency-div' ).show();
		$( '#geocode' ).hide();
		$( '#geocode input' ).val('');
		$( '#find-your-city-button' ).show();
		$( '#no-location-found' ).hide();
		
		geocodeResultLayer.clearLayers();
	});
	
	$( '#geocode-submit' ).on( 'click', function( e ) {
		e.preventDefault();
		var geocodeValue = $( '#geocode-input' ).val();
		
		MQ.geocode().search( geocodeValue )
			.on( 'success', function( e ){
				$( '#no-location-found' ).hide();
				
				if( e.result.matches.length === 0 ){
					$( '#no-location-found span' ).html( 'Sorry, no results found' );
					$( '#no-location-found' ).show();
				} else {
					var result;
					
					$.map( e.result.matches.reverse(), function( v, i ){
						if( historicTiles.options.bounds.contains( v.latlng ) ) {
							result = v;
							return;
						}
					});
					
					if( result ) {
						geocodeResultLayer.clearLayers();
						var latlng = result.latlng;
						
						L.marker( [ latlng.lat, latlng.lng ] )
							.addTo( geocodeResultLayer )
							.bindPopup( '<strong>' + geocodeValue + '</strong><br />is located here.' )
							.togglePopup();
							
						map.fitBounds( historicTiles.options.bounds );
					} else {
						$( '#no-location-found span' ).html( 'Sorry, this location is off the map' );
						$( '#no-location-found' ).show();
					}
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

function slider_init(){
	$( '#transparency-slider' ).slider({
		value: 0,
		change: changeHistoricMapOpacity,
		slide: changeHistoricMapOpacity
	});
	
	$( '#transparency-slider .ui-slider-handle' ).css( 'background-color', categories[ selectedCategory ].color );
	
	$( '.ui-slider-handle' ).append( '<span class="bar">|</span>' );
}

function changeHistoricMapOpacity(){
	historicTiles.setOpacity( ( 100 - $( '#transparency-slider' ).slider( "value" ) ) / 100 );
}