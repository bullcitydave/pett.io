var AppRouter = Parse.Router.extend({
    routes: {

       'login'           :     'goLogin',
       'signup'          :     'goSignUp',
       'home'            :     'goLanding',
       ''                :     'splash',
       ':petName'        :     'getPet'



        }


  });

    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:goSplash', function() {
        console.log('Loading splash page');
        loginView = new SplashView();
      });

    app_router.on('route:goLogin', function() {
        console.log('Loading login page');
        loginView = new LoginView();
      });

    app_router.on('route:goSignUp', function() {
        console.log('Loading signup page');
        signUpView = new SignUpView();
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
