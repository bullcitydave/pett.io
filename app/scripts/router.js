var AppRouter = Parse.Router.extend({
    routes: {

       'login'           :     'goLogin',
       'signup'          :     'goSignUp',
       'account/:user'   :     'updateAccount',
       'browse'          :     'goBrowse',
       ''                :     'goSplash',
       'pet/:petName'        :     'getPet',
       '*actions': 'goSplash'
        }


  });


    var app_router = new AppRouter();

    app_router.on('route:goSplash', function() {
        console.log('Loading splash page');
        splashView = new SplashView();
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
