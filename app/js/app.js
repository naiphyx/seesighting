const SparqlClient = require('sparql-client')
const $ = require('jquery')

// <-------------- Variables ---------------->
var endpoint = 'http://dbpedia.org/sparql'
var client = new SparqlClient(endpoint)
var results = []
var lat, long


// <----------------------------------------->
$(document).ready(function(){

  // sets the lat and lng of the current user
  getLocation()

  
  // eventhandler for input field
  $('form').submit(function( event ) {
    var city = $('#inputfield').val()
    alert(city)
    $('#inputfield').val('')
    event.preventDefault()
  });
})


// <------------ User Location --------------->
function getLocation() {
  if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition(setCoords);
  } else {
    console.log("Geolocation is not supported by this browser.")
  }
}


function setCoords(position) {
  lat = position.coords.latitude
  long = position.coords.longitude

  // centers the map at the current position of the user
  map.setCenter({lat: lat, lng: long})
}


// <---------------- Map --------------------->
function setMarkers() {

}


// <------------ DB queries ------------------>
// runs a query against the DB with given params
function queryDB(query) {
  client.query(query, function (error, results) {
    if (error) {
      console.log(error)
    } else {
      console.log(results)
    }
  })
}


function getSightsInProximity() {
  var query = ""


  queryDB(query)
}


function getSightsByCity(city) {0
  var query = "PREFIX dcterms:  <http://purl.org/dc/terms/>\
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
              ORDER BY ASC(?City)"
  queryDB(query)
}
