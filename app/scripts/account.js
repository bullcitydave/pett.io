var AccountView = Parse.View.extend({
  events: {

  },

  el: "#main-container",

  initialize: function() {
    console.log("Account view initialized");
    x=this;
    _.bindAll(this, "createPet");
    this.render();
  },

  createPet: function(e) {


    return false;
  },

  render: function() {
    this.$el.html(_.template($("#account-template").html(), ({"userName": Parse.User.current().getUsername()})));

    var ppQuery = new Parse.Query(Pet);
    // ppQuery.equalTo("person", Parse.User.current().getUsername());

    ppQuery.equalTo("person", {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
    });

    console.log('ppQuery: ',ppQuery);

    ppQuery.find({
      success: function(results) {
          x.listPets(results);
      },

      error: function(error) {
          alert('Error!');
        }
      });
    },

  listPets: function(results) {
     for (var i = 0; i < results.length ; i++) {
        console.log(results[i].attributes.name);

       $('.user-profile').append(_.template('<p>' + results[i].attributes.name + '</p>'));
     }
  }
});
