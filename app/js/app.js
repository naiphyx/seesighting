const SparqlClient = require('sparql-client')
const $ = require('jquery')

var endpoint = 'http://dbpedia.org/sparql';
var query = " PREFIX dcterms:  <http://purl.org/dc/terms/>\
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
              SELECT DISTINCT (str(?city) as ?City) (str(?label) as ?Attractions)\
              WHERE { \
                ?entity skos:broader <http://dbpedia.org/resource/Category:Tourism_by_city> .\
                ?places skos:broader ?entity .\
                ?places rdfs:label ?city .\
              FILTER langMatches(lang(?label), 'en').\
                ?attractions dcterms:subject ?places .\
                ?attractions rdfs:label ?label .\
              FILTER regex(str(?city), '(Tourist|Visitor)')\
              }\
              ORDER BY ASC(?City)\
            ";
var client = new SparqlClient(endpoint)
console.log("Query to " + endpoint)
console.log("Query: " + query)

var x, y

client.query(query, function (error, results) {
  if (error) {
    console.log(error)
  } else {
    console.log(results)
  }
})

$( 'form' ).submit(function( event ) {
  var city = $('#inputfield').val()
  alert(city)
  $('#inputfield').val('')
  event.preventDefault()
});

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
