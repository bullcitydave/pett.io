$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {
      "click #log-out"    : "logOut"
    },


    pet: "zellouisa", // default pet until function available to render first pet of user

    initialize: function() {
      self = this;
      // Need to ensure that templates load
      // $('.templates').load('templates.html', function() {
        if (Parse.User.current()) {
          self.user = Parse.User.current().getUsername();
          console.log(self.user);
          self.render();
        }
        else {
          console.log('No user signed in. Proceeding to splash screen.');
          new SplashView();
        }
      // })
    },

    render: function() {
      // NEW CODE ATTEMPT
      self.getDefaultPet(self.user);

      // WHAT WILL DO FOR NOW
      // app_router.navigate('//account/'+self.user);

      // OLD CODE
      // if (self.user === 'bullcitydave') {
      //   app_router.navigate('//' + self.pet);
      // }
      // else {
      //   app_router.navigate('//account/'+self.user);
      // }
    },


    getDefaultPet: function() {

      var dpQuery = new Parse.Query(Parse.User);
      dpQuery.equalTo("username", self.user);

      console.log('dpQuery: ',dpQuery);

      dpQuery.find({
        success: function(results) {
          // console.log(results[0].attributes.defaultPet.id.toLowerCase());
          // dp = (results[0].attributes.defaultPet.id.toLowerCase());
          dpId = results[0].attributes.defaultPet.id;
          dpQuery2 = new Parse.Query(Pet);
          dpQuery2.get(dpId, {
            success: function(results) {

            // this hasn't worked; I've tried lots of things
            self.dp = results.attributes.uniqueName;


                console.log('Default pet: ',self.dp);
                app_router.navigate('//' + self.dp);
              },
            error: function(myUser) {
              console.log('Could not determine default pet value');
            }

        });

      },

        error: function(error) {
            alert('Error retrieving default pet');
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
