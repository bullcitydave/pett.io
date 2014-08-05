var AppRouter = Parse.Router.extend({
    routes: {


             'login'           :     'goLogin',
             'home'            :     'goLanding',
             'aremid'          :     'goPetzPage',
             'a*'               :     'goLanding'




        }
    });

    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:goLogin', function() {
        loginView = new LoginView();
        console.log('Loading login page');
      });

    app_router.on('route:goPetzPage', function() {
        linkView = new LinkView({tag: 'aremid'});
        console.log('Loading petz page for ',linkView.tag);
      });

    app_router.on('route:goLanding', function() {
        console.log('Going home...');
        $('.container').load("home.html");
    })

    app_router.on('route:defaultRoute', function() {
        alert('Sorry, that function is not yet available.')
    });


    Parse.history.start();
