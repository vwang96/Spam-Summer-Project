// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

var EVENT_LOCATION = "";

function initialize() {
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'),
				 {mapTypeId:google.maps.MapTypeId.ROADMAP});
    if(navigator.geolocation){
	navigator.geolocation.getCurrentPosition(function(position){
	    var lat = position.coords.latitude;
	    var lng = position.coords.longitude;
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
	
	if (places.length == 0) {
	    return;
	}
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

	    assignClickEvent(marker,markers,map);
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

function assignClickEvent(marker,markers,map){
    var gCoder = new google.maps.Geocoder();
    console.log([marker.title,marker.getPosition().A,marker.getPosition().F]);
    google.maps.event.addListener(marker, 'click', function() {
	console.log([marker.title,marker.getPosition().A,marker.getPosition().F]);
	var eLocation = document.getElementById("eventLoc");
	var latlng = new google.maps.LatLng(marker.getPosition().A,
					    marker.getPosition().F);
	map.setZoom(17);
	map.setCenter(marker.getPosition());
	gCoder.geocode({'latLng': latlng}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
			if(eLocation.innerHTML == "Event Location: ")
			    eLocation.innerHTML = eLocation.innerHTML + 
			    results[0].formatted_address;
		    }
	});
	for(var m = 0;m<markers.length;m++)
	    if(markers[m] != marker)
		markers[m].setMap(null);
    });
}

google.maps.event.addDomListener(window, 'load',initialize);
