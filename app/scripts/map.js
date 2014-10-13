var MapView = Parse.View.extend ({

  el: "body",


  initialize: function() {


    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').removeClass('browse');
    $('#main-container').html('');

    console.log('Getting map...');

    map = this;

    var geocoder;
    var myMap;
    var marker;

    defLat = 37.09024;
    defLng = -95.712891;

    $('#main-container').append(_.template($('#map-template').html()));
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

      var petData = new Array;

      for (i = 0; i < data.length; i++) {
        petData = data[i].attributes;

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

        map.markLocation(petData);

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

    },

    markLocation: function(petData) {
      var lat = petData.geoLocation.latitude;
      var lng = petData.geoLocation.longitude;
      var infoWindow = new google.maps.InfoWindow();
      var iwContent;
      var markLatlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({'latLng': markLatlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            // myMap.setCenter(markLatlng),
            // myMap.setZoom(11);
            marker = new google.maps.Marker({
                map: myMap,
                position: results[0].geometry.location,
                infoWindow: infoWindow,
                name: petData.name,
                uName: petData.uniqueName
                // thumbnail: petData.thumbnail._url
            });
            // iwContent = "<img src='" + marker.thumbnail + "'><strong>" + marker.name + "</strong><br/>" + results[1].formatted_address;
            //
            iwContent = "<strong>" + marker.name + "</strong><br/>" + results[1].formatted_address;
            marker.infoWindow.setContent(iwContent);
            map.gInfoWindows(marker);

          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
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
        app_router.navigate('//pet/'+ marker.uName);
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
