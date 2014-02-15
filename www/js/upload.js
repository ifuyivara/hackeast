var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var imgData = '';
// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
//
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	alert(imageData);
	$("#art-img").html('<img class="up-art-img" src="'+imageData+'" />');
	imgData = imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	alert(imageURI);
	$("#art-img").html('<img class="up-art-img" src="'+imageURI+'" />');
	imgData = imageURI;
}

function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
		destinationType: navigator.camera.DestinationType.FILE_URI });
}

function getPhoto(source) {
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
		destinationType: navigator.camera.DestinationType.FILE_URI,
		sourceType: source });
}

function onFail(message) {
	alert("Error: "+message);
}

function uploadPhoto(imageURI) {
	// disable the ui
	alert(imageURI);
	$(".ui-page").addClass('ui-disabled');
	$.mobile.loading( 'show', {
		text: 'Uploading...',
		textVisible: true,
		theme: 'b'
	});
	
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	var params = {};
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;

	var ft = new FileTransfer();
	setTimeout(function(){
		ft.abort();
		alert("Transfer took too long");
	},3000);
	ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
}

function win(r) {
	$(".ui-page").removeClass('ui-disabled');
	$.mobile.loading('hide');
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
}

function fail(error) {
	$(".ui-page").removeClass('ui-disabled');
	$.mobile.loading('hide');
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}

$(document).delegate("#upload-art-form", "pageinit", function(event) {
	$("#upload-art-form #submit").on('tap', function(i){
		alert("ready?");
		alert(imgData);
		uploadPhoto(imgData);
		i.preventDefault();
		return false;
	});
});
