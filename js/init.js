var params = {};

getURLParameters();
loadData();

function initialize(){
	createCategories();
	createEvents();
}

function createEvents(){
	$( "#home-button" ).click( function(){
		$( "body" ).attr( "class", "home-screen" );
	})
}

function getURLParameters(){
	var search = location.search.substring(1);
	if ( search ) params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	// TO DO: make sure parameters are actually valid
	if ( !params.categories ) params.categories = "PR,BE";
	params.categories = params.categories.split(",");
}