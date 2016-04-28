const SparqlClient = require('sparql-client')
const $ = require('jquery')

// <-------------- Variables ---------------->
var endpoint = 'http://dbpedia.org/sparql'
var client = new SparqlClient(endpoint)
var sights = []
var markers = []
var centerLat, centerLng
var markers = [];

// <------------- onload ----------------------->
$(document).ready(function(){

  // sets the lat and lng of the current user
  getLocation()

  $('#sightlist').on('click', 'li', function() {
    showDetails(this.dataset.id)
  })
})


// eventhandler for input field
  $( 'form' ).submit(function( event ) {
    var city = $('#inputfield').val()
    $('#cityname').html(city)
    $('#inputfield').val('')
    $('#cityerror').html('')
    getSightsByCity(city)
    event.preventDefault()
  })


// view results
  function showResults(object) {
    $('#sightlist').html("")

    if(sights.length == 0) {
      $('#cityerror').html("no sights found")
    }
    else {
      for (var i = 0; i < sights.length; i++) {
        var val = sights[i].Label.value
        $('#sightlist').append('<li data-id="' + i + '">' + val + '</li>')
      }
    }
  }

// show details per sight
  function showDetails(id) {
    $('#sightlabel').html(sights[id].Label.value)
    $('#sightabstract').html(sights[id].Abstract.value)
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
    centerLat = position.coords.latitude
    centerLng = position.coords.longitude

    // centers the map at the current position of the user
    map.setCenter({lat: centerLat, lng: centerLng})
  }


  function setMarkers() {
    for (var i = 0; i < sights.length; i++) {
      addMarker({lat: parseFloat(sights[i].Lat.value), lng: parseFloat(sights[i].Long.value)}, sights[i].Label.value)
    }
  }


  function addMarker(location, label) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: label,
      animation: google.maps.Animation.DROP
    })
    markers.unshift(marker)
  }


  // runs a query against the DB with given params
  function queryDB(query) {
    client.query(query, function (error, results) {
      if (error) {
        console.log(error)
      } else {
        console.log(results.results.bindings)
        sights = results.results.bindings
        showResults()
        setMarkers()
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
                  SELECT DISTINCT (str(?label) as ?Label) (str(?lat) as ?Lat) (str(?long) as ?Long) (?abstract as ?Abstract) \
                  WHERE { \
                    ?sight dct:subject <http://dbpedia.org/resource/Category:Visitor_attractions_in_" + city + "> .\
                  FILTER langMatches(lang(?label), 'en').\
                  FILTER langMatches(lang(?abstract), 'en').\
                    ?sight rdfs:label ?label .\
                    ?sight geo:lat ?lat .\
                    ?sight geo:long ?long .\
                    ?sight dbo:abstract ?abstract \
                  }\
                  ORDER BY ASC(?Label)"
    queryDB(query)
  }
