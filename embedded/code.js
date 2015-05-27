var key = "&key=AIzaSyAgg1ndakXo3FYqjvzqRC_6pOntywp3RFo"
var placeQ = "?"
var searchQ = "?"
var place = "https://www.google.com/maps/embed/v1/place?q="
var search= "https://www.google.com/maps/embed/v1/search?q="

function setup(){
console.log("loaded");
document.getElementById("place").src=place+placeQ+key;
document.getElementById("search").src=search+searchQ+key;
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

window.onload = setup;
