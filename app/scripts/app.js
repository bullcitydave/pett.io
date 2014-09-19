$(function() {

  if (!(Parse)) { alert("oh no"); };

  Parse.history.start({
    pushState: false,
    root: '/'
  });

  var AppView = Parse.View.extend({

    el: $("#main-header"),


    events: {
      "click #log-out"    : "logOut"

      },


    initialize: function() {
      self = this;
      body = $('body');
      title = document.title;
      title = 'pett.io - the ultimate pet showcase';
      app_router = new AppRouter;



    app_router.on('route:goSplash', function() {
        console.log('Loading splash page');
        loginView = new SplashView();
      });

    app_router.on('route:goLogin', function() {
        console.log('Loading login page');
        if (!($('#main-container').hasClass("splash")))
        {
          splashView = new SplashView();
        }
        loginView = new LoginView();
      });

    app_router.on('route:goSignUp', function() {
        console.log('Loading signup page');
        if (!($('#main-container').hasClass("splash")))
        {
          splashView = new SplashView();
        }
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


    getDefaultPet: function() {

      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("username", Parse.User.current().get("username"));
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

    getAge: function(pet) {
      var query = new Parse.Query(Pet);
      query.equalTo("uniqueName", pet);
      query.first();
      query.find({
        success: function(results) {
          console.log("Successfully retrieved " + pet + ". Attempting to render...");
          var thisPet = new Pet(results[0].attributes);
          if (!(thisPet.isLiving())) {
              console.log(results[0].attributes.name + ': ' + moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
              $('#life-marker').html(moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
          }
          else {
              var age = thisPet.age();
              $('#life-marker').html(age);
              return age;
            }
          },
        error: function(collection, error) {
              console.log("Error: " + error.code + " " + error.message);
          }
        });
      },

    logOut: function(e) {
      e.preventDefault();
      Parse.User.logOut();
      console.log('Logging out and back to main login');

      $('#main-header').removeClass('standard');
      $('#main-container').removeClass('standard');
       app_router.navigate('//');
    }


  });

  window.APP = new AppView;

});
