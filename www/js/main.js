$(function() {
	
	$('#button-browse').click(function(i){
		$.mobile.navigate( "#home-browse", {transition: false});		
	});
	
	$('#button-map').click(function(i){
		$.mobile.navigate( "#home-map");		
	});

});