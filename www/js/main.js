var apiURL = 'http://192.168.23.111:3000';

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function checkArtistPermission(){

	var session = localStorage.getItem("session");
	
	if (session == "Artist"){
		return true;
	}
	
	return false;
}

function resetLoginButton(){
	if (checkArtistPermission){
		$("#artist-logged-button").show();
		$("#artist-login-ask").hide();
	} else {
		$("#artist-logged-button").hide();
		$("#artist-login-ask").show();
	}
}

$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
	$.support.cors=true;
    $.mobile.allowCrossDomainPages = true;
	
});

/**
* Setup venue browse page
*
*/
$(document).on("pageinit", "#venue-browse",function(){
	var vid =  getURLParameter("vid");
	if (vid){
		// get all art from this venue
		$.ajax({url: apiURL+'/art?vid='+vid,
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
						$("#venue-browse .columns").append('<art data-art-id="'+i.id+'" data-type="art"> \
						<img src="'+i.thumbnail+'"> \
					    <artdetail> \
							<a href="#" >'+i.title+'</a> \
							'+i.description+' \
							year: '+i.year+' \
						</artdetail> \
						</art>');
					});
					
					$("#venue-browse art").on('tap', function(event){
						$.mobile.navigate( "art.html?aid="+$(this).data('art-id'), {transition: 'slide'});
						event.preventDefault();
						return false;
					});
				} else {
					alert('There was a problem accessing the API.');
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr);
			}
			
		});
	}
});

/**
* Setup main browse page
*
*/
$(document).on("pageinit", "#home-browse",function(){
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
						$("#home-browse .columns").append('<art data-venue-id="'+i.id+'" data-type="venue"> \
						<img src="'+i.picture+'"> \
					    <artdetail> \
							<a href="#" >'+i.name+'</a> \
							'+i.description+' \
						</artdetail> \
						</art>');
					});
					
					$("#home-browse art").on('tap', function(event){
						// push venue page with venue id
						$.mobile.navigate( "venue.html?vid="+$(this).data('venue-id'), {transition: 'slide'});
						event.preventDefault();
						return false;
					});
				} else {
					alert('There was a problem accessing the API.');
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr);
			}
			
		});
		
});

/**
* Setup art page
*
*/
$(document).on("pageinit", "#single-art",function(){
	var aid =  getURLParameter("aid");
	if (aid){
		// get art from art id
		$.ajax({url: apiURL+'/art/'+aid,
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
			success: function (result) {
				if(result) {
					getArtist(result);
				} else {
					alert('There was a problem accessing the API.');
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr);
			}
			
		});
	}
	
	
});

$(document).delegate("#single-art", "pageinit", function(event) {
	$(".iscroll-wrapper", this).bind( {
		"iscroll_onpullup"   : loadMoreFromArtist
	});
});

function loadMoreFromArtist(event, someht){

	// get all art from this venue
	$.ajax({url: apiURL+'/art?aid=',
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
					$("#more-art .columns").append('<art data-art-id="'+i.id+'" data-type="art"> \
					<img src="'+i.thumbnail+'"> \
				    <artdetail> \
						<a href="#" >'+i.title+'</a> \
						'+i.description+' \
						year: '+i.year+' \
					</artdetail> \
					</art>');
				});
				
				$("#more-art art").on('tap', function(event){
					alert(1);
					$.mobile.navigate( "art.html?aid="+$(this).data('art-id'), {transition: 'slide'});
					event.preventDefault();
					return false;
				});
				
				$(".iscroll-wrapper").iscrollview("refresh");
			} else {
				alert('There was a problem accessing the API.');
			}
		},
		error: function(xhr, status, error) {
			console.log(xhr);
		}
		
	});
	
}
function getArtist(art){
	// get artist
	$.ajax({url: apiURL+'/artists/'+art.artist,
		type: 'get',
		async: 'true',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		complete: function() {
			$(".ui-page").removeClass('ui-disabled');
			$.mobile.loading('hide');
		},
		success: function (result) {
			if(result) {
				var arthtml = $('.single-art art');
				$('img', arthtml).attr('src', art.picture);
				$('.title', arthtml).html(art.title);
				$('.artist-name a', arthtml).html(result.name);
				$('.description span', arthtml).html(art.description);
				$('.medium span', arthtml).html(art.medium);
				$('.size span', arthtml).html(art.size);
				$('.year span', arthtml).html(art.year);
				$('.sold_out span', arthtml).html(art.sold_out);
				$('.buyurl', arthtml).html('<a href="'+art.buyURL+'" >buy</a>');
				
			} else {
				alert('There was a problem accessing the API.');
			}
		},
		error: function(xhr, status, error) {
			console.log(xhr);
		}
		
	});
}

$(document).on("pageinit",function(){

   	//$.mobile.navigate( "#home-browse", {transition: false});
	
	$("#filter-map-button").click(function(event){
		$( "#filter-map-panel" ).panel( "open" );	
		event.preventDefault();
	});
	
	$("#filter-button").click(function(event){
		$( "#filter-panel" ).panel( "open");	
		event.preventDefault();
	});
	
	$("#login-button").on('tap',function(event){
		
		/*
		$(".ui-page").addClass('ui-disabled');
		$.mobile.loading( 'show', {
			text: 'Loading...',
			textVisible: true,
			theme: 'b'
		});
		*/
		$( "#login-panel" ).panel( "open" );	
		event.preventDefault();
	});
	
	
	$("#submit").on('tap', function(i) { // catch the form's submit event
		i.preventDefault();
		if($('#username').val().length > 0 && $('#password').val().length > 0){
			$.ajax({url: 'http://www.swtor.com',
				data: {action : 'login', formData : 1},
				type: 'post',                  
				async: 'true',
				dataType: 'json',
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
					localStorage.setItem("session", "Artist");
					// recheck the artist permission
					resetLoginButton();
				},
				success: function (result) {
					if(result.status) {
						//$.mobile.changePage("#second");                        
					} else {
						alert('Logon unsuccessful!');
					}
				},
				error: function (request,error) {
					alert(request.status);
				}
			});           
		} else {
			alert('Please fill all necessary fields');
		}
		return false; // cancel original event to prevent form submitting
	});
	
	$("#artist-logged-button").on('tap', function(i){
		$.mobile.changePage("upload-form.html?venue=1");
	});
	
	resetLoginButton();

});