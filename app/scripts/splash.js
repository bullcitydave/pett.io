var SplashView = Parse.View.extend({

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized");
    $(window).resize(function(){
      $('#header-box').css("margin-top",($(window).height() * 0.4));
      $('#header-box-overlay').css("margin-top",($(window).height() * 0.4));
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
