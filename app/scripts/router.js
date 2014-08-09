var AppRouter = Parse.Router.extend({
    routes: {

       'login'           :     'goLogin',
       'home'            :     'goLanding',
       ''                :     'splash',
       ':petName'        :     'getPet'



        }


  });

    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:goSplash', function() {
        loginView = new SplashView();
        console.log('Loading splash page');
      });
    app_router.on('route:goLogin', function() {
        loginView = new LoginView();
        console.log('Loading login page');
      });

    app_router.on('route:getPet', function(petName) {

        console.log('Getting page for ',petName);
      linkView = new LinkView(petName);
    });

    app_router.on('route:goLanding', function() {
        console.log('Going home...');
        $('.container').load("home.html");
    })




    Parse.history.start({
      // pushState: true
    });
