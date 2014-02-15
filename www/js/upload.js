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
	$("#art-img").html('<img class="up-art-img" src="'+"data:image/jpeg;base64," + imageData+'" />');
	imgData = imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	alert(imageURI);
	$("#art-img").html('<img class="up-art-img" src="'+"data:image/jpeg;base64," + imageURI+'" />');
	imgData = imageURI;
}

function capturePhoto() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
	destinationType: destinationType.DATA_URL });
}

function getPhoto(source) {

	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
		destinationType: destinationType.FILE_URI,
		sourceType: source });
}

function onFail(message) {
	alert("Error: "+message);
}