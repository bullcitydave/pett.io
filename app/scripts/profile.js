var ProfileView = Parse.View.extend ({


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

    render: function(data){
        var profileView = $('#profile-template').html();

        $('#profile-container').html(_.template(profileView,data));
      }
});
