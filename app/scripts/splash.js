var SplashView = Parse.View.extend({

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized");
    this.render();
  },

  render: function() {
    console.log('Main el: ', this.$el);
    console.log('Head el: ', $(this.splashHead));
    $(this.splashHead).html(_.template($("#splash-header-template").html()));
    this.$el.html(_.template($("#splash-template").html()));
    this.$el.addClass('splash');
    $('.log-out').hide();
  }
});
