$(function() {


  console.log('Starting app..');

  if (!(Parse)) { alert("Cloud storage for app unavailable. Please try again later."); };
    $('#header-template').load("_browse.html", function() {
    $('#splash-template').load("_splash.html", function() {
    $('#browse-template').load("_browse.html", function() {
    $('#image-upload-template').load("_upload.html", function() {

    $('#add-pet-template').load("_addpet.html", function() {
    $('#edit-pet-template').load("_editpet.html", function() {
    $('#header-template').load("_header.html", function() {
    $('#login-template').load("_login.html", function() {
    $('#signup-template').load("_signup.html", function() {
    $('#parse-pic-template').load("_parsepic.html", function() {
    $('#flickr-template').load("_flickr.html", function() {
    $('#account-template').load("_account.html", function() {
    $('#pet-header-template').load("_petheader.html", function() {
    $('#pet-list-template').load("_petlist.html", function() {

    $('#profile-template').load("_profile.html", function() {
        console.log('Templates loaded');
        window.APP = new AppView;
        Parse.history.start({
          pushState: false,
          root: '/'
        });
    })
    })
    })
    })
    })
    })

    })
    })
    })

    })
    })
    })
    })
    })
  });
});


var AppView = Parse.View.extend({

  el: $("#main-header"),

  main : $('#main-container'),

  header : $('#main-header'),

  events: {
    "click #log-out"    : "logOut"

    },


  initialize: function() {
    self = this;
    body = $('body');

    document.title = document.title;
    app_router = new AppRouter;



  app_router.on('route:goSplash', function() {
      console.log('Loading splash page');
      loginView = new SplashView();
    });

  app_router.on('route:goLogin', function() {
      console.log('Loading login page');
      if (!(APP.main.hasClass("splash")))
      {
        splashView = new SplashView();
      }
      loginView = new LoginView();
    });

  app_router.on('route:goSignUp', function() {
      console.log('Loading signup page');
      if (!(APP.main.hasClass("splash")))
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

  app_router.on('route:goMap', function() {
      console.log('Loading map');
      mapView = new MapView();
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

  getPet: function(petName) {
    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", petName);
    query.find({
      success: function(result) {
        // return result;
      },
      error: function(collection, error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    }).then(function(result) {
      return result;
    })
  },

  // getAge: function(pet) {
  //   var query = new Parse.Query(Pet);
  //   query.equalTo("uniqueName", pet);
  //   query.first();
  //   query.find({
  //     success: function(results) {
  //       console.log("Successfully retrieved " + pet + ". Attempting to render...");
  //       var thisPet = new Pet(results[0].attributes);
  //       if (!(thisPet.isLiving())) {
  //           if(results[0].attributes.dateBirth == nullDateBirth) {
  //             $('#life-marker').html('d. ' + moment(results[0].attributes.dateDeath).year());
  //           }
  //           else {
  //             console.log(results[0].attributes.name + ': ' + moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
  //
  //             $('#life-marker').html(moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
  //           }
  //       }
  //       else {
  //           var age = thisPet.age();
  //           $('#life-marker').html(age);
  //           return age;
  //         }
  //       },
  //     error: function(collection, error) {
  //           console.log("Error: " + error.code + " " + error.message);
  //       }
  //     });
  //   },
  //

    getAge: function(pet) {

          if (!(pet.isLiving())) {
            if(pet.get("dateBirth") == nullDateBirth) {
              $('#life-marker').html('d. ' + moment(pet.get("dateDeath").year()));
            }
            else {
              // console.log(results[0].attributes.name + ': ' + moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
              //
              $('#life-marker').html(moment(pet.get("dateBirth").year())+ ' - ' + moment(pet.get("dateDeath").year()));
            }
          }
          else {
            var age = pet.age();
            $('#life-marker').html(age);
            return age;
          }
    },

  getDate: function(parseDate) {
    var parsedDate = moment(parseDate);
    var pettioDate = (parsedDate.months()+1).toString() + '/' +  parsedDate.date().toString() + '/' +  parsedDate.year().toString();
    return pettioDate;
  },


  logOut: function(e) {
    e.preventDefault();
    Parse.User.logOut();
    console.log('Logging out and back to main login');

    APP.header.removeClass('standard');
    APP.main.removeClass('standard');
     app_router.navigate('//');
  }


});
