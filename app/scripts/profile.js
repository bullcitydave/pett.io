var ProfileView = Parse.View.extend ({

  el: "#main-container",

  initialize: function(tag) {
    $('#profile-container').remove();
    APP.main.prepend('<div style="display:none" id="profile-container"></div>');
    $('#profile-container').fadeIn(750, "swing");
    $('body').addClass('no-scrolling');
    pet = tag;



    console.log('Getting profile for ', pet);

    profile = this;
    profile.thisPet = {};

    $(".pic-showcase").css("opacity", .3);



    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", profile.options);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + profile.options + ". Attempting to render...");
        profile.render(results[0].attributes);
        console.log(results[0].attributes);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

    events: {

      'click .close'    : 'closeProfile'
      // 'click #next-pic'    : 'getBackground'  disable for now

    },

    closeProfile: function(e) {
      $('#profile-container').fadeOut(750, function() {


        $('#profile-container').remove();
        $('#about').show();
        // APP.main.css('overflow', 'initial');
        $('body').removeClass('no-scrolling');
        $(".pic-showcase").css("opacity", 1);
        return false;
      });
    },

    getBackground: function() {


      // $('#profile-container .profile').css('background', ('linear-gradient(to bottom right, rgba(225,140,0,0.45), rgba(234,234,234,0.45))'));

      // var profileBackgroundImg = document.images[Math.floor(Math.random() * (document.images.length)) + 1].src;
      //
      // $('#profile-container .profile').css('background', ('linear-gradient(to bottom right, rgba(225,140,0,0.45), rgba(234,234,234,0.45)),url(' + profileBackgroundImg + ') no-repeat center center fixed' ));
    },

    render: function(data){
        _.defaults(data, {type: "null",dateBirth: "null",dateDeath: "null",dateAdopted: "null",bio: "null",favoriteTreats: "null",colors: "null",gender: "null",breeds: "null",weight: "null",bodyType: "null"});

        console.log(data);

        var ageString = null;
        data.age = "null" ;

        if (nullDateBirth.toString() != data.dateBirth.toString()) {data.dateBirth   = APP.getDate(data.dateBirth)}
          else { data.dateBirth = null };

        if (nullDateDeath.toString() != data.dateDeath.toString()) {data.dateDeath   = APP.getDate(data.dateDeath)}
          else { data.dateDeath = null };

        if (nullDateAdopted.toString() != data.dateAdopted.toString()) {data.dateAdopted = APP.getDate(data.dateAdopted)}
          else { data.dateAdopted = null };

        if (data.favoriteTreats != "null") {
          data.favoriteTreats = data.favoriteTreats.toString().split(',').join(', ');
        }
        if (data.colors != "null") {
          data.colors = data.colors.toString().split(',').join(', ');
        }
        if (data.breeds != "null") {
          data.breeds = data.breeds.toString().split(',').join(', ');
        }
        if (data.bodyType != "null") {
          data.bodyType = data.bodyType.toString().split(',').join(', ');
        }
        if ((data.DateBirth != "null") && (data.dateDeath == null)) {
          ageString = $('#life-marker').html();
          data.age = ageString.substring(0,(ageString.indexOf('old'))-1);
        }


        var profileView = $('#profile-template').html();

        $('#profile-container').html(_.template(profileView,data));

        // profile.getBackground();





        var defLat = 19.09024;
        var defLng = -99.712891;
        var myMap;


        function mapInitialize() {
          var latlng = new google.maps.LatLng(defLat,defLng);
          var mapOptions = {
            zoom: 4,
            center: latlng,
            mapTypeId: 'roadmap'
          }
          myMap = new google.maps.Map(document.getElementById('map-container'), mapOptions);
          var marker = new google.maps.Marker({
                map: myMap,
                position: latlng,
                title:"Hello World!",
                visible: true
          });
          console.log(marker);
        }

        google.maps.event.addDomListener(window, 'load', mapInitialize);
      }
});
