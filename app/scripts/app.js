$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),


    events: {
      "click #log-out"    : "logOut"
        // "click #about"    : "showProfile",
        // "click #upload"   : "imageUploadForm",
        // "click #account"  : "viewAccount"
      },


    initialize: function() {
      self = this;


      userType = "visitor";

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
                app_router.navigate('/#/pet/' + self.dp);
                },
              error: function(myUser) {
                console.log('Could not determine default pet value');
                app_router.navigate('/#/account/'+self.user);
              }
            });
          }
          else {
            app_router.navigate('/#/account/'+self.user);
          }
        },

        error: function(error) {
            alert('Could not determine default pet value');
            app_router.navigate('/#/account/'+self.user);
          }
        });
    },

    logOut: function(e) {
      Parse.User.logOut();
      console.log('Logging out and back to main login');

      $('#main-header').removeClass('standard');
      $('#main-container').removeClass('standard');
       app_router.navigate('//');
    }


  });


    // $(window).resize(function(){
      // if ($(window).height() > 575 && $(window).width() > 760) {
      //   $('#header-box').css("margin-top",($(window).height() * 0.1));
      //   $('#header-box-overlay').css("margin-top",($(window).height() * 0.1));
      // }
      // if ($(window).height() < 575 && $(window).width() > 760) {
      //   $('#header-box').css("margin-top","0");
      //   $('#header-box-overlay').css("margin-top","0");
      // }
    // });


  window.APP = new AppView;


});
