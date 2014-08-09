$(function() {

  var AppView = Parse.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        console.log(Parse.User.current().getUsername());
        new SplashView();
      } else {
        console.log('No user signed in. Proceeding to splash screen.');
        new SplashView();
      }
    },

  });

  new AppView;

});
