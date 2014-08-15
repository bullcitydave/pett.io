$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {
      "click #log-out"    : "logOut"
    },

    initialize: function() {
      self = this;
      // Need to ensure that templates load
      // $('.templates').load('templates.html', function() {
        if (Parse.User.current()) {
          self.user = Parse.User.current().getUsername();
          console.log(self.user + " is logged in");
          self.render();
        }
        else {
          console.log('No user signed in. Proceeding to splash screen.');
          new SplashView();
        }
    },

    render: function() {

      self.getDefaultPet(self.user);

    },


    getDefaultPet: function() {

      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("username", self.user);
      userQuery.find({

        success: function(results) {
          if (results[0].attributes.defaultPet) {
            defaultPetId = results[0].attributes.defaultPet.id;
            defaultPetQuery = new Parse.Query(Pet);
            defaultPetQuery.get(defaultPetId, {
              success: function(results) {
                self.dp = results.attributes.uniqueName;
                console.log('Default pet: ',self.dp);
                app_router.navigate('//' + self.dp);
                },
              error: function(myUser) {
                console.log('Could not determine default pet value');
                app_router.navigate('//account/'+self.user);
              }
            });
          }
          else {
            app_router.navigate('//account/'+self.user);
          }
        },

        error: function(error) {
            alert('Could not determine default pet value');
            app_router.navigate('//account/'+self.user);
          }
        });
    },

    logOut: function(e) {
      Parse.User.logOut();
      console.log('Logging out and back to main login');
      $('#main-container').removeClass('splash-main');
      $('#main-container').addClass('standard');
      app_router.navigate('');
      $('#main-header').removeClass('standard');
      new SplashView();
    }

  });

  APP = new AppView;

});
