var ProfileView = Parse.View.extend ({

  el: "#pet-header",

  initialize: function(tag) {
    this.pet = tag;

    console.log('Getting profile for ', this.pet);

    profile = this;


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
        if (data.dateBirth   !='null') {data.dateBirth   = profile.getDate(data.dateBirth)};
        if (data.dateDeath   !='null') {data.dateDeath   = profile.getDate(data.dateDeath)};
        if (data.dateAdopted !='null') {data.dateAdopted = profile.getDate(data.dateAdopted)};
        console.log(data.dateBirth);
        var profileView = $('#profile-template').html();
        $('#profile-container').show();
        $('#profile-container').html(_.template(profileView,data));
      }
});
