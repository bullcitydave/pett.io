$(function() {

  var AppView = Parse.View.extend({

    pet: "zellouisa", // default pet until function available to render first pet of user

    initialize: function() {
      self = this;
      this.render();
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

  });

  new AppView;

});
