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
    console.log('venue browse');
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
					    var item = Artwork.factory(i);
						$("#venue-browse #venue-artwork").append(item.elem);
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
        console.log('home browse')
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
					    var item = Venue.factory(i);
						$("#home-browse #venues").append(item.elem);
					});
					
					$("#home-browse .list-item").on('tap', function(event){
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
    console.log('single art');
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
			console.log(result);

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
console.log('single art view');
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
				$('.artist-name', arthtml).html(result.name);
				$('.description span', arthtml).html(art.description);
				$('.medium span', arthtml).html(art.medium);
				$('.size span', arthtml).html(art.size);
				$('.year span', arthtml).html(art.year);


				var available = art.sold_out ? "Available for purchase" : "Unavailable",
				    cta;
				if(art.sold_out || art.buyURL) {
				    cta = '<a class="btn" href="#">' + available + '</a>';
				} else {
				    cta = '<span class="unavailable label">' + available + '</span>';
				}
				$('.availability', arthtml).html(cta);

				
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



/*  Art piece object - example data
    alt_urls: Object
    artist: "3ad50b37-947e-46f6-940c-44804d95304f"
    buyURL: "http://www.auction.com/California/residential-auction-asset/1689257-9479-4000-Las-Ninas-Ct-SACRAMENTO-CA-95821-O443"
    description: "Third in a series of 90 painting of the beautiful Austin skyline"
    id: "1d5bfb0f-8c4b-11e3-b767-3c970e1b8563"
    medium: "Painting"
    parent_work: "237747c7-58bd-4822-a577-992714ebadf7"
    picture: "http://31.media.tumblr.com/ea544996162fc37c02cb072cd3cccae5/tumblr_n0cfp49urj1r215qmo1_500.jpg"
    series: Array[2]
    size: "24"x34""
    sold_out: "false"
    thumbnail: "http://31.media.tumblr.com/ea544996162fc37c02cb072cd3cccae5/tumblr_n0cfp49urj1r215qmo1_500.jpg"
    title: "Austin Sunrise"
    venue: "37ae018a-1fb2-4da0-8b75-e439c92e6dd5"
    year: "2014"
*/
var Artwork = {

    initialize: function(data) {
        this.data = $.extend({}, data, true);
        console.log(this);
        this.elem = this.createElem();
    },

    factory: function(data) {
        var instance = Object.create(Artwork);
        instance.initialize(data);
        return instance;
    },

    createElem: function() {
        var elem = $("<art>").addClass('art-item list-item item'),
            img = $("<img>").attr('src', this.data.thumbnail);
            title = $("<artdetail>").addClass('detail art-detail').html('<div class="title">' + this.data.title + '</div>'),
            otherDetails = $("<artdetail>").addClass('detail art-detail other').html('<div class="artist-name">Walter White</div><div class="medium">' + this.data.medium + '</div>');
        elem.prepend(img).append(title,otherDetails);
        return elem;
    }
}

/* Venue object - sample data
 *
 *  ad_1: true
 *  ad_2: true
 *  ad_3: true
 *  ad_4: true
 *  ad_5: true
 *  ad_6: true
 *  ad_7: true
 *  ad_8: false
 *  address: "100 Cesar Chavez↵Austin, TX 78702"
 *  artists: Array[1]
 *  category: "Artists & Studios"
 *  coordinates: Array[2]
 *  description: "Fun stuff made of clay by talented people."
 *  event_id: "a93335d9-ca6e-4824-8e30-fdd4551d2c7b"
 *  id: "d471b627-f7f3-4872-96e2-2af4d813673f"
 *  mail: "info@galleryhappy.org"
 *  managers: Array[1]
 *  medium: "Ceramics"
 *  name: "Gallery Happy"
 *  phone: "+1 512-555-1212"
 *  picture: "http://cdn1.bizbash.com/content/editorial/storyimg/big/htinterior-by-tim-cooperjpg_1.jpg"
 *  site_id: "101c"
 *  twitter: "@GalleryHappy"
 *  websites: Array[1]
*/

var Venue = {

    initialize: function(data) {
        this.data = $.extend({}, data, true);
        this.elem = this.createElem();
    },

    factory: function(data) {
        var instance = Object.create(Venue);
        instance.initialize(data);
        return instance;
    },

    createElem: function() {
        var elem = $("<venue>").addClass('venue list-item item'),
            img = $("<img>").attr('src', this.data.picture);
            details = $("<venuedetail>").addClass('detail venue-detail').text(this.data.description);
        elem.prepend(img).append(details);
        return elem;
    }
}
