// Enable the visual refresh
google.maps.visualRefresh = true;

var geocoder;
var infowindow = new google.maps.InfoWindow();
var marker;
var map;
var markersArray = [];

function initialize() {
    var mapOptions = {
        zoom: 5,
//        center: new google.maps.LatLng(-25.363882, 131.044922),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    geocoder = new google.maps.Geocoder();

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            geocoder.geocode({'latLng': pos}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        marker = new google.maps.Marker({
                            position: pos,
                            map: map
                        });
                        markersArray.push(marker);
                        infowindow.setContent(results[1].formatted_address);
                        infowindow.open(map);
                    } else {
                        alert('No results found');
                    }
                } else {
                    alert('Geocoder failed due to: ' + status);
                }
            });
            map.setCenter(pos);
        }, function() {
            map.setCenter(new google.maps.LatLng(-25.363882, 131.044922));
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'Select a City'
    });


    google.maps.event.addListener(map, 'click', function(e) {
        placeMarker(e.latLng, map);
    });

}
function placeMarker(position, map) {
    var lat = position.lat();
    var lng = position.lng();
    console.log(position.lat(), position.lng());
    var pos = new google.maps.LatLng(lat, lng);

    var latlng = new google.maps.LatLng(lat, lng);
    clearOverlays();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[2]) {
//                map.setZoom(11);
                console.log(results);
                console.log(results[2]);
                console.log(results[2].address_components[1]);
                if (results[2].address_components[1]) {
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });
                    markersArray.push(marker);
                    console.log(results)
                    var localResults = results[1];
                    var var1 = localResults.address_components[0].long_name;
                    var var2 = localResults.address_components[1].long_name;
                    var var3 = localResults.address_components[2].long_name;
                    var var4 = localResults.address_components[3].long_name;

                    //console.log(city)
//                    console.log(city)
//                    console.log(getCityData(city));
                    infowindow.setContent(var1 + "<br/>" + var2 + "<br/>" + var3 + "<br/>" + var3 + "<br/>");
                    infowindow.open(map, marker);
                }
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });

//    map.setCenter(pos);

//        map.panTo(position);
}

function clearOverlays() {
    for (i in markersArray) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}




google.maps.event.addDomListener(window, 'load', initialize);