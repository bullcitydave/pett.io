$(function() {

  Parse.history.start({
    pushState: false,
    root: '/'
  });

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

      var app_router = new AppRouter;
<<<<<<< HEAD



app_router.on('route:goSplash', function() {
    console.log('Loading splash page');
    splashView = new SplashView();
  });

app_router.on('route:goLogin', function() {
    console.log('Loading login page');
    splashView = new SplashView();
    loginView = new LoginView();
  });

=======



app_router.on('route:goSplash', function() {
    console.log('Loading splash page');
    loginView = new SplashView();
  });

app_router.on('route:goLogin', function() {
    console.log('Loading login page');
    loginView = new LoginView();
  });

>>>>>>> master
app_router.on('route:goSignUp', function() {
    console.log('Loading signup page');
    signUpView = new SignUpView();
  });

app_router.on('route:updateAccount', function(user) {
    console.log('Loading account page');
    accountView = new AccountView(user);
  });

app_router.on('route:goBrowse', function() {
    console.log('Loading browse view');
    browseView = new BrowseView();
});

app_router.on('route:getPet', function(petName) {
    console.log('Getting page for ',petName);

    linkView = new LinkView(petName);
});

},


    render: function() {

      self.getDefaultPet(self.user);

    },


    getDefaultPet: function(user) {

      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("username", user.getUsername());
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

});
    
