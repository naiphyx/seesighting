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
