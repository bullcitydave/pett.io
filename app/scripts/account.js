var AccountView = Parse.View.extend({
  events: {

  },

  el: "#main-container",

  initialize: function() {
    console.log("Account view initialized")
    _.bindAll(this, "createPet");
    this.render();
  },

  createPet: function(e) {


    return false;
  },

  render: function() {
    this.$el.html(_.template($("#account-template").html(), ({"userName": Parse.User.current().getUsername()})));
  }
});
