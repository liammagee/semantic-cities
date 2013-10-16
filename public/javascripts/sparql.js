

function getCityQuery(city) {
//    return "http://dbpedia.org/sparql?query=PREFIX dbo: <http://dbpedia.org/ontology/>SELECT ?name WHERE {?country rdf:type dbo:Country.?country foaf:name ?name}LIMIT 50&format=json";
    var query = "http://dbpedia.org/sparql?query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/>PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema/>SELECT * WHERE { <http://dbpedia.org/resource/%city%> ?p ?o . }&format=json"
    return query.replace("%city%", city);
}
//PREFIX dbo: <http://dbpedia.org/ontology/>
//PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/>
//PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema/>
//        "FILTER(?p != rdf:type && ?p != rdfs:comment && ?p != rdfs:label) " +

function getCityData(city) {
    var query = getCityQuery(city);
    $.get(query, function(result) {
        var list = result.results.bindings;
        console.log(list)
    });

}
