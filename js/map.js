var map,
	modernTiles,
	geocodeResultLayer,
	historicTiles,
	attribution;
function createMap(){
	map = L.map( "mapdiv", { zoomControl: false, attributionControl: false} ).setView( [40,-80], 5 );
	modernTiles = L.tileLayer( "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png" , { maxNativeZoom : 18, maxZoom : 21 }).addTo(map);
	geocodeResultLayer = L.layerGroup().addTo(map);
	attribution = L.control.attribution().addTo( map );
	attribution.setPrefix( '' );
	attribution.addAttribution( 'Basemap tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL' );
}

function selectMap( id ){
	if ( historicTiles ) map.removeLayer( historicTiles );
	map.setMaxBounds( null );
	
	var mapData = maps[ id ];
	var bounds = L.latLngBounds([ 
		[mapData.bottom, mapData.left],
		[mapData.top, mapData.right]
	]);
	
	map.options.maxZoom = ( mapData.MaxZoom );
	map.options.minZoom = ( mapData.MinZoom );
	
	historicTiles = L.tileLayer( "tiles/" + id + "/{z}/{x}/{y}.png", {
		tms : true,
		bounds : bounds,
		maxZoom : mapData.MaxZoom,
		maxNativeZoom : mapData.MaxZoom
	} ).addTo(map);
	
	setTimeout( function() {
		map.fitBounds( bounds, {animate: true, paddingTopLeft: [ 300, 110 ]  } );
	}, 1000 );
	
	map.setMaxBounds( bounds.pad(.25) );

	$( "#reset-map" ).hide();

	$( "#slider-thumbnail" ).attr( "xlink:href", "data/img/thumbnails/" + id + ".jpg" );

	showDetailsList( id );

	pageButtonsForScreen( "map" );
	$( "#interaction-elements" ).css( "right", $( "#map-share-button" ).width() + 41 );

	map.on( "movestart", onMapMove );

	$( "#reset-map" ).click( function(){
		if( $( '#detail-single' ).is( ':visible' ) ) $( '#detail-back' ).click();
		map.off( "movestart", onMapMove )
			.fitBounds( bounds, {animate: false, paddingTopLeft: [ 300, 110 ] });
		setTimeout( function(){
			$( "#reset-map" ).hide();
			map.on( "movestart", onMapMove );
		},750);
	})
	
	$( "#zoom-out-button" ).click( function(){
		map.zoomOut();
	});
	
	$( "#zoom-in-button" ).click( function(){
		map.zoomIn();
	});
	
	//----Mobile specific buttons----//
	$( '#mobile-icons #info').on( 'click', function() {
		showDetailsList( id, true );
		$( '#details-panel' ).show();
	});
	
	$( '#mobile-icons #geolocate' ).on( 'click', function() {
		if( navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition( geolocateSuccess, geolocateError );
		} else {
			error( 'Sorry, I couldn\' find your location.' );
		}
	});
	
	$( '#details-close' ).on( 'click', function() {
		$( '#details-panel' ).hide();
	});
	
	//set up sharing buttons for this particular map
	$( '#facebook-share' ).attr( 'href', 'https://www.facebook.com/sharer/sharer.php?u=' + url + '?mapId=' + id );
	$( '#twitter-share' ).attr( 'href', 'https://twitter.com/home?status=' + url + '?mapId=' + id );
	$( '#email-share' ).attr( 'href', 'mailto:?&body=' + url + '?mapId=' + id );
}

function onMapMove(){
	$( "#reset-map" ).show();
}

function showMap(){
	addBreadcrumb( 'Map Viewer', 'map' );
	if( $( window ).width() < 767 ) $( '#breadcrumbs #map-button .mobile' ).show();
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
		$( '#geocode input' ).focus();
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

		var url = 'https://search.mapzen.com/v1/search?text=' + geocodeValue + '&api_key=mapzen-LEEN1KD';
		$.getJSON(url, function (results) {
			$( '#no-location-found' ).hide();

			if( results.features.length === 0 ){
				$( '#no-location-found span' ).html( 'Sorry, no results found' );
				$( '#no-location-found' ).show();
			} else {
				var result;

				results.features.some(function( v, i ){
					if( historicTiles.options.bounds.contains( v.geometry.coordinates.reverse() ) ) {
						result = v.geometry.coordinates;
						return true;
					}
				});

				if( result ) {
					geocodeResultLayer.clearLayers();
					var latlng = result;

					var geocodeIcon = L.icon({
						iconUrl: 'img/' + selectedCategory + '-marker.png',
						iconSize: [62, 82],
						iconAnchor: [31, 82]
					});

					L.marker( result, {icon: geocodeIcon } )
						.addTo( geocodeResultLayer );

					map.panTo( result, { animate: false } );
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
	
	if( $( '.ui-slider-handle span' ).length == 0 ) $( '.ui-slider-handle' ).append( '<span class="bar">|</span>' );
}

function changeHistoricMapOpacity(){
	historicTiles.setOpacity( ( 100 - $( '#transparency-slider' ).slider( "value" ) ) / 100 );
}

function geolocateSuccess( position ){
	var latlng = L.latLng( position.coords.latitude, position.coords.longitude );
	
	if(  map.getBounds().contains( latlng ) ){
		var geocodeIcon = L.icon({
			iconUrl: 'img/' + selectedCategory + '-marker.png',
			iconSize: [62, 82],
			iconAnchor: [31, 82]
		});
		
		L.marker( latlng, {icon: geocodeIcon } )
			.addTo( geocodeResultLayer );
			
		// map.setView({ center: latlng, zoom: map.options.maxZoom }); // won't work for some reason
		map.setZoom( map.options.maxZoom );
		setTimeout(function(){
			map.panTo( latlng );
		}, 1000);
	} else {
		geolocateError( 'Your location is not inside the map bounds' );
	}
}

function geolocateError( msg ){
	if ( typeof msg != "string" ) msg = "Sorry, your location is not available";
	alert( msg );
}