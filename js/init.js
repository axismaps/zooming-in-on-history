var params = {};

getURLParameters();
loadData();

function initialize(){
	createCategories();
	createEvents();
	createMap();
}

function createEvents(){
	$( "#home-button" ).click( showHome );
	$( ".screen" ).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$(this).removeClass( "fadeIn" );
	});
}

function getURLParameters(){
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	// TO DO: make sure parameters are actually valid
	if ( !params.categories ) params.categories = "PR,BE";
	params.categories = params.categories.split(",");
}

function changeScreens( $from, $to ){
	$from.addClass( "animated fadeOut" );
	$to.show().removeClass( "fadeOut" ).addClass( "animated fadeIn" );
	setTimeout( function(){
		$from.hide();
	},1000);
}

function addBreadcrumb( title ){
	var bc = $( '#breadcrumbs' );
	bc.append( '<div id="' + title + '-button">' + title + '</div>' );
}