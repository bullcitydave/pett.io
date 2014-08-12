$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {

      "click .log-out"    : "logOut"
    },


    pet: "zellouisa", // default pet until function available to render first pet of user

    initialize: function() {
      self = this;
      $('.templates').load('templates.html', function() {
        if (Parse.User.current()) {
          self.user = Parse.User.current().getUsername();
          console.log(self.user);
          self.render();
        }
        else {
          console.log('No user signed in. Proceeding to splash screen.');
          new SplashView();
        }
      })
    },

    render: function() {
      if (self.user === 'bullcitydave') {
        app_router.navigate('//' + self.pet);
      }
      else {
        app_router.navigate('//account/'+self.user);
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
