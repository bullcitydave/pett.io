$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {

      "click .log-out"    : "logOut"
    },


    pet: "zellouisa", // default pet until function available to render first pet of user

    initialize: function() {
      self = this;
      $('.templates').load('templates.html', function()
      {
        self.render();
      })
    },

    render: function() {
      if (Parse.User.current()) {
        console.log(Parse.User.current().getUsername());
        app_router.navigate('//'+self.pet);
      } else {
        console.log('No user signed in. Proceeding to splash screen.');
        new SplashView();
      }
    },

    logOut: function(e) {
      Parse.User.logOut();
      console.log('Logging out and back to main login');
      $('#main-container').removeClass('splash-main');
      $('#main-container').addClass('standard');
      app_router.navigate('');
      $('#main-header').removeClass('standard');
      new SplashView();
    },

  });

  new AppView;

});
