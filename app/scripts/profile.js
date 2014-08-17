var ProfileView = Parse.View.extend ({

  el: "#pet-header",

  initialize: function(tag) {
    this.pet = tag;

    console.log('Getting profile for ', this.pet);

    profile = this;

    nullDateBirth = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";
    nullDateDeath = "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)";
    nullDateAdopted = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";



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
      $('#profile-container').html('');
      $('#profile-container').hide();
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
        $('#profile-container').show();
        $('#profile-container').html(_.template(profileView,data));
      }
});
