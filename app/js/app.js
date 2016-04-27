const SparqlClient = require('sparql-client')
const $ = require('jquery')

// sparql-client setup
var endpoint = 'http://dbpedia.org/sparql'
var query = 'select distinct ?Concept from <http://dbpedia.org> where {[] a ?Concept} limit 100'
var client = new SparqlClient(endpoint)

var x, y

// run query with callbacks
client.query(query, function (error, results) {
  if (error) {
    console.log(error)
  } else {
    console.log(results)
  }
})





function centerMaptoGeolocation(position){
	map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
  console.log("lat: " + position.coords.latitude + " long: " + position.coords.longitude)
}


function getLocation() {
  if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(centerMaptoGeolocation);
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}


$(document).ready(function(){

})
