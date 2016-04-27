var SparqlClient = require('sparql-client');

var endpoint = 'http://dbpedia.org/sparql';
var query = 'select distinct ?Concept from <http://dbpedia.org> where {[] a ?Concept} limit 100';
var client = new SparqlClient(endpoint);
console.log("Query to " + endpoint);
console.log("Query: " + query);
client.query(query, function (error, results) {
    console.log(results);
});
