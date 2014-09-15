var ProfileView = Parse.View.extend ({

  el: "#main-container",

  initialize: function(tag) {
    $('#profile-container').remove();
    $('#main-container').prepend('<div id="profile-container"></div>');
    body.toggleClass('no-scrolling');
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

        thesePets.fetch({
        success: function(collection) {
            console.log(collection);
            var thisPet = thesePets.get(results[0].id);
            if (!(thisPet.isLiving())) {
              console.log(results[0].attributes.name + ': ' + moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
              $('#life-marker').html(moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());

              }
            else {
              $('#life-marker').html(thisPet.age() + ' years old');
              }
            },
        error: function(collection, error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
    console.log(results[0].attributes);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

    events: {

      'click #close-profile'    : 'closeProfile'
      // 'click #next-pic'    : 'getBackground'  disable for now

    },

    closeProfile: function(e) {
      $('#profile-container').remove();
      $('#about').show();
      // $('#main-container').css('overflow', 'initial');
      body.toggleClass('no-scrolling');
      $(".pic-showcase").css("opacity", 1);
      return false;
    },

    getDate: function(parseDate) {
      var parsedDate = moment(parseDate);
      var pettioDate = parsedDate.months().toString() + '-' +  parsedDate.date().toString() + '-' +  parsedDate.year().toString();
      return pettioDate;
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

        if (nullDateBirth.toString() != data.dateBirth.toString()) {data.dateBirth   = profile.getDate(data.dateBirth)}
          else { data.dateBirth = null };

        if (nullDateDeath.toString() != data.dateDeath.toString()) {data.dateDeath   = profile.getDate(data.dateDeath)}
          else { data.dateDeath = null };

        if (nullDateAdopted.toString() != data.dateAdopted.toString()) {data.dateAdopted = profile.getDate(data.dateAdopted)}
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

        var profileView = $('#profile-template').html();

        $('#profile-container').html(_.template(profileView,data));

        profile.getBackground();
      }
});
