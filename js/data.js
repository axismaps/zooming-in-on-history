var categories,
	details,
	maps;

function loadData(){
	$.get( "data/csv/categories.csv", function(c){
		categories = _.indexBy( Papa.parse( c, { header: true } ).data, "id" );
		$.get( "data/csv/details.csv", function(d){
			details = Papa.parse( d, { header: true } );
			$.get( "data/csv/maps.csv", function(m){
				maps = _.indexBy( Papa.parse( m, { header: true } ).data, "number" );
				initialize();
			});
		});
	});
}