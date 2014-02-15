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

$(document).on("pageshow", "#home-map",function(){
	$(".ui-content").css('padding', 0);
	$("#map_canvas").css('height', getRealContentHeight());
	$("#map_canvas").gmap({'center': "30.274559,-97.736836", 'zoom': 15, 'disableDefaultUI':true});
	
	$('#map_canvas').gmap().bind('init', function(evt, map) {
		// get all the venues
		$.ajax({url: apiURL+'/venues',
			type: 'get',
			async: 'true',
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			beforeSend: function() {
				$(".ui-page").addClass('ui-disabled');
				$.mobile.loading( 'show', {
					text: 'Loading...',
					textVisible: true,
					theme: 'b'
				});
			},
			complete: function() {
				$(".ui-page").removeClass('ui-disabled');
				$.mobile.loading('hide');
			},
			success: function (result) {
				if(result) {	
					result.forEach(function(i){
						var marker = new google.maps.LatLng(i.coordinates[0], i.coordinates[1]);
						$('#map_canvas').gmap('addMarker', {'position': marker, 'bounds': true}).click(function() {
							var venue_info = '<img src="'+i.picture+'" width="40px" /><a href="venue.html?venue='+i.id+'" data-transition="slide">'+i.name+'</a><p>'+i.description+'</p>';
							$('#map_canvas').gmap('openInfoWindow',{ 'content': venue_info }, this);
						});
					});
				} else {
					alert('There was a problem accessing the API.');
				}
			},
			error: function(xhr, status, error) {
				alert(xhr.status);
			}
			
		});
		
		$('#map_canvas').gmap('getCurrentPosition', function(position, status) {
			if ( status === 'OK' ) {
				var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				$('#map_canvas').gmap('addMarker', {'position': clientPosition, 'bounds': true});
			}
		});   
	});
});

$(document).on("pageinit",function(){
	
	
	
});