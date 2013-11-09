// Enable the visual refresh
google.maps.visualRefresh = true;

var geocoder;
var infowindow = new google.maps.InfoWindow();
var map;
var markersArray = [];


var doGeolocation = function() {
    geocoder = new google.maps.Geocoder();

    if (false) {
//    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            geocoder.geocode({'latLng': pos}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[2]) {
                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map
                        });
                        markersArray.push(marker);
                        infowindow.setContent(results[2].formatted_address);
                        infowindow.open(map);


                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
            map.setCenter(pos);
        }, function () {
            map.setCenter(new google.maps.LatLng(-25.363882, 131.044922));
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function initialiseMaps() {
    var mapOptions = {
        zoom: 2,
//        center: new google.maps.LatLng(-25.363882, 131.044922),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    doGeolocation();

    google.maps.event.addListener(map, 'click', function(e) {
        placeMarker(e.latLng, map);
    });

}



function placeMarker(position, map) {
    var lat = position.lat();
    var lng = position.lng();
    var pos = new google.maps.LatLng(lat, lng);

    var latlng = new google.maps.LatLng(lat, lng);
    clearOverlays();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[2]) {
//                map.setZoom(11);
                if (results[2].address_components[1]) {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    markersArray.push(marker);
                    var localResults = _.map(results[2].address_components, function(component) { return component.long_name });
                    if (localResults.length >= 4) {
                        var city = localResults[localResults.length - 3];
                        getCityData(city, function(err) {
                            if (!err) {
                                infowindow.setContent(city);
                                infowindow.open(map, marker);

                                map.setCenter(pos);

                                map.panTo(position);
                            }
                            else {
                                alert(err);
                            }
                        });
                    }
                    else {
                        console.log('No results found');
                    }
                }
            } else {
                console.log('No results found');
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });
}

var clearOverlays = function() {
    for (i in markersArray) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}

var handleNoGeolocation = function(errorFlag) {
    var content = "";
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

//    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}




var getCityData = function(city, func) {
    $.get(sparqlQuery(city), function(result) { processResults(result, func); });
}

var sparqlQuery = function(city) {
    var query = "http://dbpedia.org/sparql?query=PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns/>PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema/>SELECT * WHERE { <http://dbpedia.org/resource/%city%> ?p ?o . }&format=json"
    query = query.replace("%city%", encodeURIComponent(encodeURIComponent(city)));
    // Needs to be doubly encoded
    return query;
}

var processResults = function(result, func) {
    var ignorePredicates = [
        "http://www.w3.org/2000/01/rdf-schema#label",
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "http://www.w3.org/2002/07/owl#sameAs",
        "http://purl.org/dc/terms/subject"
    ];
    var preferredLanguage = "en";
    var list = result.results.bindings;
    if (list && !_.isUndefined(list)) {


        $('#city-contents').empty();
        _.forEach(list, function(predicate) {
            var o = predicate.o, p = predicate.p;
            var display = true;
            if (_.indexOf(ignorePredicates, p.value) > -1)
                display = false;
            if (o['xml:lang'] && o['xml:lang'] != preferredLanguage)
                display = false;
            if (display)
                displayLine(p, o);
        });
    }
    else {
        func("No results found");
    }
}

var stripUrl = function(url) {
    var hash = url.lastIndexOf('#');
    var slash = url.lastIndexOf('/');
    var pos = (hash > slash ? hash : slash);
    if (pos > -1) {
        url = url.substring(pos + 1);
    }
    return url;
};

var displayLine = function(p, o) {
    var dispO = o.value, dispP = stripUrl(p.value);
    var objLink = dispO;
    if (o.value.indexOf('http') == 0)
        objLink = '<a href="' + dispO + '" target="_blank">' + dispO + '</a>';
    $('#city-contents').append('<tr><td>' + dispP + '</td><td>'+ objLink + '</td></tr>');

};



google.maps.event.addDomListener(window, 'load', initialiseMaps);