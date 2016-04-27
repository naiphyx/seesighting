var SparqlClient = require('sparql-client');
const $ = require('jquery')

var endpoint = 'http://dbpedia.org/sparql';
var query = 'select distinct ?Concept from <http://dbpedia.org> where {[] a ?Concept} limit 100';
var client = new SparqlClient(endpoint);
console.log("Query to " + endpoint);
console.log("Query: " + query);
client.query(query, function (error, results) {
    console.log(results);
});


var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

$(document).ready(function(){

})