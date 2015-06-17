//name space so that users can't access fxn & var in browser console
// can be removed without much changes
function nameSpace(){
    var event_location,event_latlng,dirService,dirDisplay,D_BOUNDS,map;
    var markers = []; //array of all current markers on the map
    var eButton = document.getElementById("confirmEvent");//confirm event btn
    var freq = document.getElementById("frequency");//freq update selection
    var mUpd = document.getElementById("manualUpdate");//manual update loc btn
    var updateInterval;//keeps track of loc update interval obj
    //html text to show current event location
    var eLocation = document.getElementById("eventLoc");
    //google obj to get address|latlng given one 
    var gCoder = new google.maps.Geocoder();

    
    function initialize() {
	map = new google.maps.Map(document.getElementById('map-canvas'),
			{mapTypeId:google.maps.MapTypeId.ROADMAP});
	dirService = new google.maps.DirectionsService();//used to find route
	dirDisplay = new google.maps.DirectionsRenderer({//displays route found
	    suppressMarkers:true});//won't auto add markers to route
	if(navigator.geolocation){//if browsewr supports HTML geolocation
	    navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		map.setCenter({'lat':lat,'lng':lng});//centers user location
		map.setZoom(17);
		//all user searches will be biased toward this initial map bound		
		D_BOUNDS = map.getBounds(); 
		
	    },function(){//if user denied access
		map.setCenter({'lat':0,'lng':0});
		map.setZoom(1);
		D_BOUNDS = map.getBounds();
	    });
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
	    dirDisplay.setMap(null); //removes any route currently being displayed
	    if (places.length == 0) {
		return; //if no results, nothing happens, return
	    }
	    for (var i = 0, marker; marker = markers[i]; i++) 
		marker.setMap(null); //takes all current markers off the map
	    
	    // For each place, get the icon, place name, and location.
	    markers = []; //removes them all from the array
	    var bounds = new google.maps.LatLngBounds(); //bounds obj
	    for (var i = 0, place; place = places[i]; i++) {
		var image = { //setting marker icon detail for each marker
		    url: place.icon,
		    size: new google.maps.Size(71, 71),
		    origin: new google.maps.Point(0, 0),
		    anchor: new google.maps.Point(17, 34),
		    scaledSize: new google.maps.Size(25, 25)
		};
		
		// Create a marker for each place.
		var marker = new google.maps.Marker({
		    map: map, //map to bound to
		    icon: image, 
		    title: place.name, //the place name, not addr
		    position: place.geometry.location
		});
		assignClickEvent(marker,map);
		markers.push(marker);//add marker to array of markers
		//google offers no other way to access them

		//tells bound obj to expand to include the current marker
		bounds.extend(place.geometry.location);
	    }
	    
	    //bounds obj will now include all markers returned by places
	    map.fitBounds(bounds);
	});
	// [END region_getplaces]
	
	//Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
	    //D_BOUNDS = map.getBounds();
	    //un comment the above to bias search to current bound
	    searchBox.setBounds(D_BOUNDS); //always centered original position
	});
	
    }
    
    //when a marker is clicked, it's choosen as the event location and added
    //to the list of 'history of selected places'
    function assignClickEvent(marker,map){
	google.maps.event.addListener(marker, 'click', function() {
	    //google latlng obj to track location
	    var latlng = new google.maps.LatLng(marker.getPosition().A,
						marker.getPosition().F);
	    dirDisplay.setMap(null);//clears any route displayed
	    map.setZoom(16);//sets zoom
	    map.setCenter(marker.getPosition());//centers on marker clicked
	    gCoder.geocode({'latLng': latlng}, function(results, status) {
		//getting the address of the latlng location
		if (status == google.maps.GeocoderStatus.OK) {
		    eLocation.innerHTML = marker.title + " @ "+ 
			results[0].formatted_address;
		    event_location = eLocation.innerHTML;
		    event_latlng = latlng;
		    //creates the history list and attaches click event
		    createEventObj(results[0].formatted_address,
				   marker.title,map);	
		}
	    });
	    //clears all OTHER markers from the array & map
	    for(var z = 0;z< markers.length;z++)
		if(markers[z] !== marker){
		    markers[z].setMap(null);
		    markers.splice(z--,1);
		}
	});
    }
    
    //creates the history list and assigns click events to each
    function createEventObj(addr,name,map){
	//gets the table, creates new row,col,cell,set innerHTML
	var tb = document.getElementById("allLocs");
	var r = tb.insertRow(tb.rows.length); //adds to end
	var c1 = r.insertCell(0);
	c1.innerHTML = name+" "+addr;
	//add click event that centers on prev selected locations
	r.addEventListener("click",function(){
	    dirDisplay.setMap(null);//clears any routes
	    gCoder.geocode({"address":addr},function(results,status){
		if(status == google.maps.GeocoderStatus.OK){
		    //changes what is displayed in html text
		    eLocation.innerHTML = name + " @ "+addr;
		    event_location = eLocation.innerHTML;
		    event_latlng = results[0].geometry.location;
		    //centers map on location
		    map.setCenter(results[0].geometry.location);
		    //creates marker for it
		    var marker = new google.maps.Marker({
			map: map,
			title:name,
			position: results[0].geometry.location
		    });
		    //tracks the marker
		    markers.push(marker);
		    //deletes every OTHER marker
		    for(var m =0,thisM;thisM=markers[m];m++)
			if(thisM != marker){
			    thisM.setMap(null);
			    markers.splice(m--,1);
			}
		}
	    });
	});
    }
    
    
    function calcETA(){
	dirDisplay.setMap(null);
	//tells route to be displayed on the map
	dirDisplay.setMap(map);
	var lat,lng;
	if(navigator.geolocation){
	    navigator.geolocation.getCurrentPosition(function(position){
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		var request = {
		    origin: new google.maps.LatLng(lat,lng),
		    destination: event_latlng,
		    travelMode: google.maps.TravelMode.DRIVING
		};
		//calls ggl API to calc route w/ the request data
		dirService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
			var ETA = document.getElementById("ETA");
			//tells it to display first route/direction returned
			dirDisplay.setDirections(response);
			ETA.innerHTML = "ETA: "+response.routes[0].legs[0].duration.text;
			//lists out the directions for the first route
			loadSteps(response.routes[0].legs[0].steps);
		    }
		    else
			console.log(status);
		});
	
		
	    });
	}
    }

    function loadSteps(steps){
	//getting old table body
	var old = document.getElementById("directions").tBodies[0];
	//creating new table body
	var tb = document.createElement("tbody");
	//enumerating directions and rows
	for(var i = 0;i<steps.length;i++){
	    var r = tb.insertRow(tb.rows.length); //adds to end
	    var c1 = r.insertCell(0);
	    c1.innerHTML = steps[i].instructions;
	}
	//replacing old one w/ new one
	old.parentNode.replaceChild(tb,old);
    }
    
    
    function update(){
	if(updateInterval)//if interval is not NULL
	    clearInterval(updateInterval);//clear it
	//if freq of update changed to not manual
	if(freq.value != "manual"){
	    mUpd.style.visibility="hidden";//hide button
	    //set to update every X seconds,X being from menu selection
	    updateInterval= setInterval(calcETA,parseInt(freq)*1000);
	}
	else{//if freq of update changed to manual
	    mUpd.style.visibility="visible";//unhide button
	    calcETA();//update it once
	}
    }
    
    
    eButton.addEventListener("click",calcETA);
    freq.addEventListener("change",update);
    mUpd.addEventListener("click",update);
    initialize();
}		      


//waits until page is completely loaded
google.maps.event.addDomListener(window, 'load',nameSpace);
