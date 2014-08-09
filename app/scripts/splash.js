var SplashView = Parse.View.extend({
  events: {
    // "click #login": "goLogIn"
    // ,
    // // "submit form.signup-form": "signUp"
  },

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized");
    // _.bindAll(this, "logIn", "signUp");
    this.render();
  },

  // goLogIn: function(e) {
  //   newLoginView;
  // },

  render: function() {
    console.log('Main el: ', this.$el);
    console.log('Head el: ', $(this.splashHead));
    $(this.splashHead).html(_.template($("#splash-header-template").html()));
    this.$el.html(_.template($("#splash-template").html()));
  }
});
