var MapView = Parse.View.extend ({

  // el: "body",

  initialize: function() {


    // $('#main-header').addClass('standard');
    // $('#main-container').removeClass('splash');
    // $('#main-container').addClass('standard');
    // $('#main-container').removeClass('browse');
    // $('#main-container').html('');
    $('#main-container').remove();
    $('#main-header').remove();


    console.log('Getting map...');

    // map = this;

    var geocoder;
    var myMap;
    var marker;

    // defLat = 37.09024;
    // defLng = -95.712891;

    // $('#main-container').append(_.template($('#map-template').html()));
    // $('#map-canvas').show();


var latlng = new google.maps.LatLng(35,-96);
var mapOptions = {
  zoom: 4,
  center: latlng,
  mapTypeId: 'roadmap'
}
myMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
marker = new google.maps.Marker({
      map: myMap,
      position: latlng,
      title:"Hello World!",
      visible: true
});



    // google.maps.event.addDomListener(window, 'load', this.mapInitialize);

    var query = new Parse.Query(Pet);
    var tempGeo = new Parse.GeoPoint(45,-45);
    query.near("geoLocation",tempGeo );
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length+ ". Attempting to render...");
        // map.render(results);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

    render: function(data){

      this.mapInitialize();
      // this.markLocation(data[0].attributes.geoLocation);
    },

    mapInitialize: function () {
      // geocoder = new google.maps.Geocoder();
      // var latlng = new google.maps.LatLng(defLat,defLng);
      // var latlng = new google.maps.LatLng(35,-96);
      // var mapOptions = {
      //   zoom: 4,
      //   center: latlng,
      //   mapTypeId: 'roadmap'
      // }
      // myMap = new google.maps.Map(document.getElementById('map-container'), mapOptions);
      // marker = new google.maps.Marker({
      //       map: myMap,
      //       position: latlng,
      //       title:"Hello World!",
      //       visible: true
      // });
    },


    markLocation: function(geoPoint) {
      var lat = geoPoint.latitude;
      var lng = geoPoint.longitude;
      var infowindow = new google.maps.InfoWindow();
      var markLatlng = new google.maps.LatLng(lat, lng);
      var markImg = "http://i.imgur.com/khXNhWD.png";

      geocoder.geocode({'latLng': markLatlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            myMap.setCenter(markLatlng),
            myMap.setZoom(11);
            marker2 = new google.maps.Marker({
                map: myMap,
                position: results[1].geometry.location,
                title: results[1].formatted_address,
                zindex: 9999999
            });
            infowindow.setContent(results[1].formatted_address);
            infowindow.open(myMap, marker2);
          } else {
            alert('No results found');
          }
        } else {
          alert('Geocoder failed due to: ' + status);
        }
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
