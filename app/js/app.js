const SparqlClient = require('sparql-client')
const $ = require('jquery')
const magnificPopup = require('magnific-popup')

// <-------------- Variables ---------------->
var endpoint = 'http://dbpedia.org/sparql'
var client = new SparqlClient(endpoint)
var sights = []
var markers = []
var infoWindows = []
var centerLat, centerLng


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
    $('#sightlabel').html('')
    $('#sightabstract').html('')
    $('#sightthumb').attr("src", '')
    getSightsByCity(city)
    event.preventDefault()
  })


// view results
  function showResults(object) {
    $('#sightlist').html("")

    if(sights.length == 0) {
      $('#cityerror').html("We are terribly sorry, we were not able to find any sights matching your city. ")
    }
    else {
      for (var i = 0; i < sights.length; i++) {
        var val = sights[i].Label.value
        $('#sightlist').append('<li data-id="' + i + '"><a href="#current-details" class="detail-popup">' + val + '</a></li>')
      }
    }
    // add popup functionality after li are appended
    $('.detail-popup').magnificPopup({
      type:'inline',
      midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    })
  }


// show details per sight
  function showDetails(id) {
    $('#sightlabel').html(sights[id].Label.value)
    $('#sightabstract').html(sights[id].Abstract.value)
    $('#sightthumb').attr("src", sights[id].Thumbnail.value)
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
    map.addListener('click', function() {
      closeInfowindows()
    })
  }

  function addMarkers() {
    clearMarkers()
    for (var i = 0; i < sights.length; i++) {
      addDelayedMarkers(sights[i], i * 50)
    }
  }


  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
    }
  }


  function closeInfowindows() {
    for (var i = 0; i < infoWindows.length; i++) {
      infoWindows[i].close()
    }
  }


  function addDelayedMarkers(sight, delay) {
    var string = ''
    if(sight.Thumbnail.value != '') string += '<img src=' + sight.Thumbnail.value + ' style="margin: 15px 5px 0 5px" />'
    string += '<p>' + sight.Label.value + '</p>'

    window.setTimeout(function() {
      var marker = new google.maps.Marker({
        position: {lat: parseFloat(sight.Lat.value), lng: parseFloat(sight.Long.value)},
        map: map,
        title: sight.Label.value,
        animation: google.maps.Animation.DROP
      })
      marker.info = new google.maps.InfoWindow({
        content: string
      })
      infoWindows.push(marker.info)
      google.maps.event.addListener(marker, 'click', function() {
        closeInfowindows()
        marker.info.open(map, marker)
      })
      markers.push(marker)
    }, delay)
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
        $('html, body').stop().animate({
          scrollTop: $(document).height()
        }, 1500)
        addMarkers()
        var mean = getLocationMean()
        console.log("lat: " + mean.lat + " long: " + mean.long);
        map.setCenter({lat: mean.lat, lng: mean.long})
      }
    })
  }


  function getLocationMean() {
    var mean = {
      lat: 0,
      long: 0
    }

    for (var i = 0; i < sights.length; i++) {
      mean.lat += parseFloat(sights[i].Lat.value)
      mean.long += parseFloat(sights[i].Long.value)
    }

    mean.lat = mean.lat / sights.length
    mean.long = mean.long / sights.length
    return mean
  }


  function getSightsInProximity() {
    var query = ""


    queryDB(query)
  }


  function getSightsByCity(city) {
    city = city.replace(" ", "_")
    var query = "PREFIX dcterms:  <http://purl.org/dc/terms/>\
                  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                  SELECT DISTINCT (str(?label) as ?Label) (str(?lat) as ?Lat) (str(?long) as ?Long) (str(?thumbnail) as ?Thumbnail) (?abstract as ?Abstract)\
                  WHERE { \
                    ?sight dct:subject <http://dbpedia.org/resource/Category:Visitor_attractions_in_" + city + "> .\
                  FILTER langMatches(lang(?label), 'en').\
                  FILTER langMatches(lang(?abstract), 'en').\
                    ?sight rdfs:label ?label .\
                    ?sight geo:lat ?lat .\
                    ?sight geo:long ?long .\
                    ?sight dbo:thumbnail ?thumbnail .\
                    ?sight dbo:abstract ?abstract \
                  }\
                  ORDER BY ASC(?Label)"
    queryDB(query)
  }
