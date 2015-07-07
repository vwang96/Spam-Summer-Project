//name space so that users can't access fxn & var in browser console
// can be removed without much changes
function nameSpace(){
    var event_location,event_latlng,dirService,dirDisplay,D_BOUNDS,map;
    var markers = []; //array of all current markers on the map
    if(document.URL.indexOf("/events") >=0){
    var eButton = document.getElementById("confirmEvent");//confirm event btn
    var freq = document.getElementById("frequency");//freq update selection
    var mUpd = document.getElementById("manualUpdate");//manual update loc btn
    var modeT = document.getElementById("mode");//mode of transport selection
	}
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
		
	    },deniedAccess);
	}
	else deniedAccess();
	
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
	    dirDisplay.setMap(null);//removes any route currently displayed
	    clearInterval(updateInterval);
	    loadSteps([],null);
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
	    if(places.length == 1)
		google.maps.event.trigger(markers[0],"click");
	    
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

    function deniedAccess(){//if user denied access
	map.setCenter({'lat':0,'lng':0});
	map.setZoom(1);
	D_BOUNDS = map.getBounds();
    }
    
    //when a marker is clicked, it's choosen as the event location and added
    //to the list of 'history of selected places'
    function assignClickEvent(marker,map){
	google.maps.event.addListener(marker, 'click', function() {
	    //google latlng obj to track location
	    var latlng = new google.maps.LatLng(marker.getPosition().A,
						marker.getPosition().F);
	    dirDisplay.setMap(null);//clears any route displayed
	    clearInterval(updateInterval);
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
		//alerts if any error reported by google API
		else window.alert("assignClickEvent:"+status);
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
	var r = tb.insertRow(1); //adds to beginning
	var c1 = r.insertCell(0);
	c1.innerHTML = name+" "+addr;
	//add click event that centers on prev selected locations
	r.addEventListener("click",function(){
	    clearInterval(updateInterval);
	    dirDisplay.setMap(null);//clears any routes
	    loadSteps([],null);//clears directions table
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
		//alerts any error reported by ggl API
		else window.alert("createEventObj:"+status);
	    });
	});
    }
    
    
    function calcETA(){
	if(document.getElementById("eventLoc").innerHTML==="")
	    return; //if no event location set, do nothing
	dirDisplay.setMap(null);
	//clears ALL markers
	for(var i = 0;i<markers.length;i++)
	    markers[i].setMap(null);
	markers=[];

	var lat,lng;
	if(navigator.geolocation){ //getting user location using HTML5
	    navigator.geolocation.getCurrentPosition(function(position){
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		//creating new marker for user 
		var marker = new google.maps.Marker({
		    map:map,
		    title:"You",
		    position: new google.maps.LatLng(lat,lng),
		    icon:{
			url:"images/userIcon.png", //gets user icon
			scaledSize: new google.maps.Size(50,50),//scales icon
			origin: new google.maps.Point(0,0),//sets origin?
			//which part of the icon is attached/pointed to location
			anchor: new google.maps.Point(25,25)
		    }
		});
		//if you click on the user icon, you will be redirected
		google.maps.event.addListener(marker,"click",function(){
		    window.location.href = "image/userIcon.png";
		});
		
		//accuracy circle opts
		var circleOpts = {
		    'clickable': false,
		    'radius': 0,
		    'strokeColor': '1bb6ff',
		    'strokeOpacity': .4,
		    'fillColor': '61a0bf',
		    'fillOpacity': .4,
		    'strokeWeight': 1,
		    'zIndex': 1
		};
		//creates new circle instance passing circle Opts from b4
		var circle = new google.maps.Circle(circleOpts);
		//bind to marker
		circle.bindTo("center",marker,"position");
		//bind to map
		circle.bindTo("map",marker);
		//sets radius of circle to reflect HTML5 geolocation accuracy
		circle.setRadius(position.coords.accuracy);

		markers.push(marker); //tracking the marker
		//new marker for event Location
		marker = new google.maps.Marker({
		    map:map,
		    title:"Your Target",
		    position: event_latlng,
		    icon:{
			url:"images/target.png",
			scaledSize: new google.maps.Size(50,50),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(25,50)
		    }
		});
		markers.push(marker);
		//get travel mode selected, default to driving
		var travelMode = document.getElementById("mode").value;
		var request = {
		    origin: new google.maps.LatLng(lat,lng),
		    destination: event_latlng,
		    travelMode: google.maps.TravelMode[travelMode]
		};
		//calls ggl API to calc route w/ the request data
		dirService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
			var ETA = document.getElementById("ETA");
			//tells it to display first route/direction returned
			dirDisplay.setDirections(response);
			//tells which map it's displayed on
			dirDisplay.setMap(map);
			ETA.innerHTML = "ETA: "+
			    response.routes[0].legs[0].duration.text;
			//lists out the directions for the first route
			loadSteps(response.routes[0].legs[0].steps,
				 response.routes[0].bounds);
		    }
		    else
			window.alert("calcETA: "+status);
		});		
	    });
	}
    }
    
    function loadSteps(steps,bounds){
	//getting old table body
	var old = document.getElementById("directions").tBodies[0];
	//creating new table body
	var tb = document.createElement("tbody");

	//enumerating directions and rows
	for(var i = 0;i<steps.length;i++){
	    var r = tb.insertRow(tb.rows.length); //adds to end
	    var c1 = r.insertCell(0);
	    c1.innerHTML = steps[i].instructions;
	    zoomOnStep(c1,steps[i],bounds);
	}
	//replacing old one w/ new one
	old.parentNode.replaceChild(tb,old);
    }
    
    function zoomOnStep(row,step,origBounds){
	var loc = step.start_location;
	var clickedOn = false;
	row.addEventListener("click",function(){
	    for(var z = 2;z<markers.length;z++){
		markers[z].setMap(null);
		markers.splice(z--,1);
	    }
	    if(!clickedOn){
		var marker = new google.maps.Marker({
		    map: map,
		    title: step.instructions.replace(/[<](b|\/b)[>]/g," "),
		    position: loc
		});
		markers.push(marker);
		map.setZoom(17);
		map.panTo(loc);
		clickedOn = true;
	    }
	    else{
		var bounds = new google.maps.LatLngBounds();
		var NE = new google.maps.LatLng(origBounds.za.A,
						origBounds.qa.A);
		var SW = new google.maps.LatLng(origBounds.za.j,
						origBounds.qa.j);
		bounds.extend(NE);
		bounds.extend(SW);
		map.fitBounds(bounds);
		clickedOn = false;
	    }
	});
    }

    function update(){
	clearInterval(updateInterval);//clear interval
	//if freq of update changed to not manual
	if(freq.value != "manual"){
	    mUpd.style.visibility="hidden";//hide button
	    //set to update every X seconds,X being from menu selection
	    updateInterval= setInterval(calcETA,parseInt(freq.value)*1000);
	    calcETA();
	}
	else{//if freq of update changed to manual
	    mUpd.style.visibility="visible";//unhide button
	    calcETA();//update it once
	}
    }
    
    if(document.URL.indexOf("/event") >=0){
    eButton.addEventListener("click",update);
    modeT.addEventListener("change",update);
    freq.addEventListener("change",update);
    mUpd.addEventListener("click",update);
    }
    initialize();
}		      


//waits until page is completely loaded
google.maps.event.addDomListener(window, 'load',nameSpace);
