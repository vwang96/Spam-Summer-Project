// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

function nameSpace(){
    var event_location;
    var event_latlng;
    var D_BOUNDS="";
    var markers = [];
    var eButton = document.getElementById("confirmEvent");
    
    function initialize() {
	var map = new google.maps.Map(document.getElementById('map-canvas'),
				      {mapTypeId:google.maps.MapTypeId.ROADMAP});
	if(navigator.geolocation){
	    navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		map.setCenter({'lat':lat,'lng':lng});
		map.setZoom(17);
		D_BOUNDS = map.getBounds();
	    });
	}
	else{
	    var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(-33.8902, 151.1759),
		new google.maps.LatLng(-33.8474, 151.2631));
	    map.fitBounds(defaultBounds);
	    D_BOUNDS = map.getBounds();
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
	    for (var i = 0, marker; marker = markers[i]; i++) 
		marker.setMap(null);   
	    
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
		assignClickEvent(marker,map);
		markers.push(marker);
		
		bounds.extend(place.geometry.location);
	    }
	    
	    
	    map.fitBounds(bounds);
	});
	// [END region_getplaces]
	
	//Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
	    //var bounds = map.getBounds();
	    searchBox.setBounds(D_BOUNDS); //always centered original position
	});
	
    }
    
    function assignClickEvent(marker,map){
	var gCoder = new google.maps.Geocoder();
	google.maps.event.addListener(marker, 'click', function() {
	    var eLocation = document.getElementById("eventLoc");
	    var latlng = new google.maps.LatLng(marker.getPosition().A,
						marker.getPosition().F);
	    map.setZoom(16);
	    map.setCenter(marker.getPosition());
	    gCoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		    eLocation.innerHTML = marker.title + " @ "+ 
			results[0].formatted_address;	
		    createEventObj(results[0].formatted_address,
				   marker.title,map);	
		}
	    });
	    for(var z = 0;z< markers.length;z++)
		if(markers[z] !== marker){
		    markers[z].setMap(null);
		    markers.splice(z--,1);
		}
	});
    }
    
    function createEventObj(addr,name,map){
	var tb = document.getElementById("allLocs");
	var r = tb.insertRow(tb.rows.length); //adds to end
	var c1 = r.insertCell(0);
	c1.innerHTML = name+" "+addr;
	r.addEventListener("click",function(){
	    var gCoder = new google.maps.Geocoder();
	    gCoder.geocode({"address":addr},function(results,status){
		if(status == google.maps.GeocoderStatus.OK){
		    var eLocation = document.getElementById("eventLoc");
		    eLocation.innerHTML = name + " @ "+addr;
		    map.setCenter(results[0].geometry.location);
		    var marker = new google.maps.Marker({
			map: map,
			title:name,
			position: results[0].geometry.location
		    });
		    markers.push(marker);
		    for(var m =0,thisM;thisM=markers[m];m++)
			if(thisM != marker){
			    thisM.setMap(null);
			    markers.splice(m--,1);
			}
		}
	    });
	});
    }
    
    eButton.addEventListener("click",function(){
	console.log("clicked");
    });
    initialize();
}		      

google.maps.event.addDomListener(window, 'load',nameSpace);
