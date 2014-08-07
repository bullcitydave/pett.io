var AppRouter = Parse.Router.extend({
    routes: {


             'login'           :     'goLogin',
             'home'            :     'goLanding',
              ''               : 'goLogin',
              'pet/:petName':   'getPet'

        }


  });

    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:goLogin', function() {
        loginView = new LoginView();
        console.log('Loading login page');
      });

    app_router.on('route:getPet', function(petName) {
      console.log('Getting page for ',petName);
      linkView = new LinkView(petName);
    });

    app_router.on('route:goPetzPage', function() {
        linkView = new LinkView({tag: 'aremid'});
        console.log('Loading petz page for ',linkView.tag);
      });

    app_router.on('route:goPetzPagez', function() {
        linkView = new LinkView({tag: 'zellouisa'});
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
