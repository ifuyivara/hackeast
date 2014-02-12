function getRealContentHeight() {
    var header = $.mobile.activePage.find("div[data-role='header']:visible");
    var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
    var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
    var viewport_height = $(window).height();

    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    if((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
        content_height -= (content.outerHeight() - content.height());
    } 
    return content_height;
}

$(function() {
	$(".ui-content").css('padding', 0);
	$("#map_canvas").css('height', getRealContentHeight());
	$("#map_canvas").gmap({'center': "30.274559,-97.736836", 'zoom': 15, 'disableDefaultUI':true, 'callback': function() {
		var self = this;
		self.addMarker({'position': this.get('map').getCenter() }).click(function() {
			self.openInfoWindow({ 'content': 'Hello World!' }, this);
		});	
	}});
	
	$('#map_canvas').gmap().bind('init', function(evt, map) {
		$('#map_canvas').gmap('getCurrentPosition', function(position, status) {
			if ( status === 'OK' ) {
				var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				
				var testPositions = [ 
				{ lat:'30.440519', lon:'-97.691158'}, 
				{ lat:'30.440639', lon:'-97.695106'}, 
				{ lat:'30.438882', lon:'-97.687853'}, 
				{ lat:'30.441037', lon:'-97.689173'}
				]
				
				$('#map_canvas').gmap('addMarker', {'position': clientPosition, 'bounds': true});
				
				testPositions.forEach(function(i){
					var marker = new google.maps.LatLng(i.lat, i.lon);
					$('#map_canvas').gmap('addMarker', {'position': marker, 'bounds': true});
				});
				
				// use 'bounds': true when you populate the map with markers
				//$('#map_canvas').gmap('get','map').setOptions({'center': clientPosition});
				//$('#map_canvas').gmap('get','map').setOptions({'bounds': true});
			}
		});   
	});
	
});