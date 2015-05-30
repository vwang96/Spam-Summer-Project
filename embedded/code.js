var key = "&key=AIzaSyAgg1ndakXo3FYqjvzqRC_6pOntywp3RFo"
var placeQ = "?"
var searchQ = "?"
var place = "https://www.google.com/maps/embed/v1/place?q="
var search= "https://www.google.com/maps/embed/v1/search?q="

function setup(){
console.log("loaded");
document.getElementById("place").src=place+placeQ+key;
document.getElementById("search").src=search+searchQ+key;
mapSetup();
}

function update(){
    console.log("works");
    var newQ = document.getElementById("sBar").value;
    newQ = newQ.replace(" ","+") 
    if(newQ.length!=0){
	document.getElementById("place").src=place+newQ+key;
	document.getElementById("search").src=search+newQ+key;
    }
    return false;
}

function mapSetup(){
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP
    }); 
    if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(pos){
	    var lat = pos.coords.latitude;
	    var lng = pos.coords.longitude;
	    var bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(lat-0.025,lng-0.025),
		new google.maps.LatLng(lat+0.025,lng+0.025));
	    map.fitBounds(bounds);
	    map.setCenter({'lat':lat,'lng':lng});
	    map.setZoom(17);
	});
    }
    else{
	var defaultBounds = new google.maps.LatLngBounds(
	    new google.maps.LatLng(-33.8902, 151.1759),
	    new google.maps.LatLng(-33.8474, 151.2631));
	map.fitBounds(defaultBounds);
    } 
  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
      console.log(places);
    if (places.length == 0) {
      return;
    }
      console.log(places[0].formatted_address);
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

window.onload = setup;
