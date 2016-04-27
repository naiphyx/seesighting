const SparqlClient = require('sparql-client');
const $ = require('jquery')

// sparql-client setup
var endpoint = 'http://dbpedia.org/sparql';
var query = 'select distinct ?Concept from <http://dbpedia.org> where {[] a ?Concept} limit 100';
var client = new SparqlClient(endpoint);

// run query with callbacks
client.query(query, function (error, results) {
  if (error) {
    console.log(error)
  } else {
    console.log(results)
  }
})


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

$(document).ready(function(){

  getLocation()



})



// gets the lat and long of the user
function showPosition(position) {
  console.log("lat: " + position.coords.latitude + " long: " + position.coords.longitude)
}


function getLocation() {
  if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}
