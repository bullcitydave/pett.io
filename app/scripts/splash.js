var SplashView = Parse.View.extend({

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized");


    Parse.Cloud.run('hello', {}, {
  success: function(result) {
    console.log(result); // result is 'Hello world!'
  },
  error: function(error) {
  }
});


    this.render();
  },

  render: function() {
    $('body').addClass('splash');
    $('body').removeClass('darkbg');
    $(this.splashHead).html(_.template($("#header-template").html(),({"userName":''})));
    this.$el.html(_.template($("#splash-template").html()));
    this.$el.addClass('splash');
    $('#header-nav').hide();
  }
});
