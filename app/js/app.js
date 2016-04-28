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
})


// eventhandler for input field
  $( 'form' ).submit(function( event ) {
    var city = $('#inputfield').val()
    $('#cityname').html(city)
    $('#inputfield').val('')
    getSightsByCity(city)
    event.preventDefault()
  })


// view results
  function showResults(object) {
    var arr = object.results.bindings
    $('#sightlist').html("")

    if(arr.length == 0) {
      $('#cityerror').html("no sights found for " + $('#cityname').val())
    }
    else {
      for (var i = 0; i < arr.length; i++) {
        var val = arr[i].Label.value
        $('#sightlist').append("<li>" + val + "</li>")
      }
    }
  }


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
      showResults(results)
    }
  })
}


function getSightsInProximity() {
  var query = ""


  queryDB(query)
}


function getSightsByCity(city) {
  city = city.replace(" ", "_")
  var query = "PREFIX dcterms:  <http://purl.org/dc/terms/>\
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                SELECT DISTINCT (str(?label) as ?Label) (str(?lat) as ?Lat) (str(?long) as ?Long)\
                WHERE { \
                  ?sight dct:subject <http://dbpedia.org/resource/Category:Visitor_attractions_in_" + city + "> .\
                FILTER langMatches(lang(?label), 'en').\
                  ?sight rdfs:label ?label .\
                  ?sight geo:lat ?lat .\
                  ?sight geo:long ?long\
                }\
                ORDER BY ASC(?Label)"
  queryDB(query)
}
