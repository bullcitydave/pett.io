var MapView = Parse.View.extend ({

  el: "body",


  initialize: function() {


    APP.header.addClass('standard');
    APP.main.removeClass('splash');
    APP.main.addClass('standard');
    APP.main.removeClass('browse');
    APP.main.html('');

    console.log('Getting map...');

    map = this;

    var geocoder;
    var myMap;
    var marker;
    map.markers = [];
    var mp;  // map positions array
    var bounds;

    defLat = 37.09024;
    defLng = -95.712891;

    APP.main.append(_.template($('#map-template').html()));
    $('#map-canvas').show();

    var query = new Parse.Query(Pet);
    var tempGeo = new Parse.GeoPoint(45,-45);
    query.near("geoLocation",tempGeo );
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length+ ". Attempting to render...");
        map.render(results);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

  },

    render: function(data){
      this.mapInitialize();

      var mapPet = new Pet;

      for (i = 0; i < data.length; i++) {
        mapPet = data[i].attributes;

        // var petUName = petData.uniqueName;
        // var tnQuery = new Parse.Query(ParsePic);
        // tnQuery.equalTo("petUniqueName",petUName);
        // tnQuery.select("thumbnail");
        //
        // tnQuery.find({
        //   success: function(results) {
        //       if (results.length > 0) {
        //         var randomImg = Math.floor(Math.random() * (results.length));
        //         petData[i].thumbnail = results[randomImg].attributes.thumbnail._url;
        //       };
        //
        //   }
        // });

        map.markLocation(mapPet);

      }

    },

    mapInitialize: function () {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(defLat,defLng);
      var mapOptions = {
        zoom: 4,
        center: latlng,
        mapTypeId: 'roadmap'
      }
      myMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      bounds = new google.maps.LatLngBounds();

    },

    markLocation: function(pet) {
      var lat = pet.geoLocation.latitude;
      var lng = pet.geoLocation.longitude;
      var infoWindow = new google.maps.InfoWindow();
      var iwContent;
      var markLatlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({'latLng': markLatlng}, function(results, status) {
        var city;
        if (status == google.maps.GeocoderStatus.OK) {
          for (var b=0;b<results.length;b++) {
            if (_.contains(results[b].types,"locality")) {
                    city= results[b];
                    break;
                }
            }
          if (city) {
            // myMap.setCenter(markLatlng),
            // myMap.setZoom(11);
            if (!(_.contains(map.mp,city.geometry.location.toString()))) {
              marker = new google.maps.Marker({
                  map: myMap,
                  position: city.geometry.location,
                  positionString: city.geometry.location.toString(),
                  infoWindow: infoWindow,
                  pets: [pet]
                  // thumbnail: petData.thumbnail._url
              });

              bounds.extend(marker.position);
	            myMap.fitBounds(bounds);

              map.markers.push(marker);
              map.mp = _.map(map.markers, function(marker){return marker.position.toString()});
              // iwContent = "<img src='" + marker.thumbnail + "'><strong>" + marker.name + "</strong><br/>" + results[1].formatted_address;
              //
              iwContent = "<p>" + city.formatted_address + "</p><p><strong>" + pet.name  + "</strong></p>";
              marker.infoWindow.setContent(iwContent);
              map.gInfoWindows(marker);
            }
            else {
              console.log('Found match');
              marker = _.findWhere(map.markers, {positionString: city.geometry.location.toString()});
              marker.pets.push(pet);
              iwContent = marker.infoWindow.getContent() + "<p><strong>" + pet.name  + "</strong></p>";
              marker.infoWindow.setContent(iwContent);
            }
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed for ' + lat + '/' + lng + ' due to: ' + status);
        }
      });
    },

    gInfoWindows: function(marker) {
      google.maps.event.addListener(marker, 'mouseover', function() {
        marker.infoWindow.open(myMap, this);
      });

      google.maps.event.addListener(marker, 'mouseout', function() {
        marker.infoWindow.close();
      });

      google.maps.event.addListener(marker, 'click', function() {
        marker.infoWindow.close();
        app_router.navigate('//pet/'+ marker.pet.uniqueName);
      });
    }

});


//
// var defLat = 19.09024;
// var defLng = -99.712891;
// var myMap;
//
//
// function mapInitialize() {
//   var latlng = new google.maps.LatLng(defLat,defLng);
//   var mapOptions = {
//     zoom: 4,
//     center: latlng,
//     mapTypeId: 'roadmap'
//   }
//   myMap = new google.maps.Map(document.getElementById('map-container'), mapOptions);
//   var marker = new google.maps.Marker({
//         map: myMap,
//         position: latlng,
//         title:"Hello World!",
//         visible: true
//   });
//   console.log(marker);
// }
//
// google.maps.event.addDomListener(window, 'load', mapInitialize);
