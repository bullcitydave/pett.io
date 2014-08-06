var ProfileView = Parse.View.extend ({
  className : 'pet-profile',

  initialize: function() {
    this.pet = 'aremid';
    self = this;
    console.log('Getting profile for ', this.pet);




    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", this.pet);
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + this.pet + ". Attempting to render...");
        self.render(results[0].attributes);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
},

    render: function(data){
        var profileView = $('#profile-template').html();
        $('#parseMontage').append(_.template(profileView,data));
        this.$el.html(rendered);
        return this;
      }
});
