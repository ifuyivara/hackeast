$(function() {
	

	//$.mobile.navigate( "#home-browse", {transition: false});		
	
	$("#filter-map-button").click(function(i){
		$( "#filter-map-panel" ).panel( "open" );	
	});
	
	$("#filter-button").click(function(i){
		$( "#filter-panel" ).panel( "open");	
	});
	
	$("art").click(function(i){
		alert(this.data('type'));
	});
	
	
	

});