var ProfileView = Parse.View.extend ({

  el: "#main-container",

  initialize: function(tag) {

    $('#main-container').prepend('<div id="profile-container"></div>');
    this.pet = tag;

    console.log('Getting profile for ', this.pet);

    profile = this;

    nullDateBirth = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";
    nullDateDeath = "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)";
    nullDateAdopted = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";


    $(".pic-showcase").css("opacity", .3);



    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", profile.pet);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + profile.pet + ". Attempting to render...");
        profile.render(results[0].attributes);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  },

    events: {

      'click #close-profile'    : 'closeProfile'

    },

    closeProfile: function(e) {
      $('#profile-container').hide();
      $(".pic-showcase").css("opacity", 1);
      return false;
    },

    getDate: function(parseDate) {
      var pettioDate = moment(parseDate).year();
      return pettioDate;
    },

    render: function(data){
        _.defaults(data, {type: "null",dateBirth: "null",dateDeath: "null",dateAdopted: "null",bio: "null",favoriteTreats: "null",colors: "null"});
        console.log(data);
        console.log(data.dateBirth);
        if (nullDateBirth.toString() != data.dateBirth.toString()) {data.dateBirth   = profile.getDate(data.dateBirth)}
          else { data.dateBirth = null };
        if (nullDateDeath.toString() != data.dateDeath.toString()) {data.dateDeath   = profile.getDate(data.dateDeath)}
          else { data.dateDeath = null };
        if (nullDateAdopted.toString() != data.dateAdopted.toString()) {data.dateAdopted = profile.getDate(data.dateAdopted)}
          else { data.dateAdopted = null };
        console.log(data.dateBirth);
        var profileView = $('#profile-template').html();
        // $('#profile-container').show();
        $('#profile-container').html(_.template(profileView,data));
        var profileBackgroundImg = document.images[Math.floor(Math.random() * (document.images.length)) + 1].src;

        $('#profile-container .profile').css('background', ('linear-gradient(to bottom right, rgba(225,140,0,0.85), rgba(234,234,234,0.85)),url(' + profileBackgroundImg + ') no-repeat center center fixed' ));
      }
});
