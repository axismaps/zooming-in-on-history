var categories,
	details,
	maps;

function loadData(){
	$.get( "data/csv/categories.csv", function(c){
		categories = Papa.parse( c, { header: true } );
		$.get( "data/csv/details.csv", function(d){
			details = Papa.parse( d, { header: true } );
			$.get( "data/csv/maps.csv", function(m){
				maps = Papa.parse( m, { header: true } );
				initialize();
			});
		});
	});
}