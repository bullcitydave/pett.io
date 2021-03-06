var SplashView = Parse.View.extend({

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    thisView = this;
    console.log("Splash view initialized");
    this.render();
  },

  render: function() {
    $('body').addClass('splash');
    thisView.getSplashImgUrl();
    $('body').removeClass('darkbg');
    APP.header.removeClass('standard');
    APP.header.addClass('splash');
    $(this.splashHead).html(_.template($("#header-template").html(),({"userName":''})));
    this.$el.html(_.template($("#splash-template").html()));
    this.$el.addClass('splash');
    $('#header-nav').hide();
  },

  getSplashImgUrl: function(){
    var randomImg = Math.floor(Math.random() * 10);
    var imagePath = '../images/splash/splash';
    var bgImgAttrib = 'no-repeat 50% 25% fixed';
    $('body.splash').css('background',('linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)),url("' + imagePath + randomImg + '.jpg")' + bgImgAttrib));
    $('body.splash').css('background-size',('cover'));
  }
});
