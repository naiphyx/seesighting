const SparqlClient = require('sparql-client')
const $ = require('jquery')

// <-------------- Variables ---------------->
var endpoint = 'http://dbpedia.org/sparql'
var client = new SparqlClient(endpoint)
var results = []
var lat, long


// <------------- onload ----------------------->
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
