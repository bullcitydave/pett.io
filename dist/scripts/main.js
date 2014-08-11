// Initialize parse and support functions


  Parse.initialize("9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC", "DGHfzC6pvsu3P94CsFDReHIpwB3CUf7Pe0dP4WiP");



function getDims(image) {
  dimsPromise = Promise.resolve(function(image){
    var dimsPromise = Promise.resolve($("<img/>").attr("src", url).load());
    return dimsPromise.then(function(image) {
        dims = {w:this.width, h:this.height};
        console.log(dims);
        return dims;
    });
  });
};

var flickrApiKey = "806745a8a5db2aff0b0cdb591b633726";
var flickrUserId = 'toastie97';

    var Pet = Parse.Object.extend("Pet", {





    });

    var ParsePic = Parse.Object.extend("ParsePic", {





    });


    var FlickrPic = Parse.Object.extend("FlickrPic", {

      defaults:{

      }

    });


    var FlickrPicList = Parse.Collection.extend({
        model: FlickrPic,
        url: 'https://api.parse.com/1/classes/',

        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        comparator: function(flickrpic) {
          return flickrpic.get('order');
        }

      });


    var ParsePicList = Parse.Collection.extend({
        model: ParsePic,

        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        comparator: function(parsepic) {
          return parsepic.get('order');
        }

      });

      var Vine = Parse.Object.extend("Vine", {

        defaults:{ "source" : "vine"

        }

      });


      var VineList = Parse.Collection.extend({
          model: Vine,

          nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
          },

          comparator: function(vine) {
            return vine.get('order');
          }

        });

var ProfileView = Parse.View.extend ({


  initialize: function(tag) {
    this.pet = tag;

    console.log('Getting profile for ', this.pet);

    profile = this;


    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", profile.pet);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + profile.pet + ". Attempting to render...");
        profile.render(results[0].attributes);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
},

    render: function(data){
        _.defaults(data, {dateDeath: "null"});
        var profileView = $('#profile-template').html();
        $('#profile-container').html(_.template(profileView,data));
      }
});

var LinkView = Parse.View.extend({

  el: "#main-header",



  initialize: function(tag) {
    if (!(tag)) {tag = 'zellouisa'};
    pet=tag;
    console.log('Initializing LinkView. Tag:',tag);
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-header').html(_.template($('#splash-header-template').html()));
    $('#main-header').append(_.template($('#pet-header-template').html(),({"petName":tag})));
    $('body').addClass('whitebg');
    new ParsePicListView(tag);
    new FlickrPicListView(tag);
  },


  events: {
    "click #about"    : "showProfile"
  },

  showProfile: function(e) {
    new ProfileView(pet);
  }


});



var FlickrPicListView = Parse.View.extend({
     el: "#main-container",

    initialize: function(tag) {
      console.log("Initializing FlickrPicListView. Tag: ", tag);
      this.flickrPicList = new FlickrPicList;
      this.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + flickrUserId + "&tags=" + tag +"&per_page=16&page=1&format=json&nojsoncallback=1";
      console.log("Flickr URL is ", this.flickrApiUrl);
      this.render();

    },



    render: function () {
      //
      // $('.montageSquare').bind('load', function() {
      // console.log('height ', $('.montageSquare').clientHeight);
      // console.log('width ',  $('.montageSquare').clientWidth);
      // });

        // container.masonry({
        //     columnWidth: 40,
        //     itemSelector: '.picContainer'
        //   });
        //   var msnry = container.data('masonry');
        //   console.log(msnry);


      $.getJSON(this.flickrApiUrl + "&format=json&nojsoncallback=1").done(function(photoData){
          var flickrView = $('#flickr-template').html();
          var flickrImg = '';
          var photoId = '';
          var farmId='';
          var serverId ='';
          var secret='';

          for (var i = 0; i < 9 ; i++) {
            if (!photoData.photos.photo[i]) {
              continue;
            }
              photoId = photoData.photos.photo[i].id;
              farmId = photoData.photos.photo[i].farm;
              serverId = photoData.photos.photo[i].server;
              secret = photoData.photos.photo[i].secret;
              flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_b.jpg';
              console.log('Rendering Flickr image: ',flickrImg);
              $('#main-container').append(_.template(flickrView,({"flickrImg":flickrImg})));
            }



            // for (var i = 0; i < 9 ; i++) {
            //     if ($('.montageSquare')[i].clientHeight > $('.montageSquare')[i].clientWidth)
            //     {
            //       console.log('Vertical!');
            //       $(".montageSquare").eq(i).css("border", "solid 2px darkorange");
            //       $(".picContainer").eq(i).addClass("w2");
            //     }
            // }
        });
      }
    });


var ParsePicListView = Parse.View.extend({

    initialize: function(tag) {
      parseSelf=this;
      console.log('Initializing parse pic view. Tag: ',tag);
      this.render(tag);

    },

    render: function(tag) {

      var ppQuery = new Parse.Query(ParsePic);
      ppQuery.equalTo("username", Parse.User.current().getUsername());
      ppQuery.equalTo("petname", tag);

      console.log('ppQuery: ',ppQuery);

      ppQuery.find({
        success: function(results) {
            parseSelf.showPics(results);
        },

        error: function(error) {
            alert('Error!');
          }
        });
      },

    showPics: function(results) {
       this.parseView = $('#parse-pic-template').html();
       for (var i = 0; i < results.length ; i++) {
          console.log(results[i]);
          console.log(results[i].attributes.url);
          console.log(this.parseView);
         $('#main-container').append(_.template(this.parseView,({"parseImg":results[i].attributes.url})));
       }
     }


});


// var VineListView = Parse.View.extend({
    //
    // initialize: function() {
    //   this.vineList = new VineList;
    //   this.tag = 'mokshadog';
    //   this.vineApiUrl = 'http://protected-harbor-8958.herokuapp.com/api/timelines/tags/' + this.tag;
    //   this.render();
    //
    // },
    //
    //
    //
    // render: function () {
    //   tag = this.tag;
    //   $.getJSON(this.vineApiUrl).done(function(vineData, tag){
    //     var vineView = $('#vine-template').html();
    //     console.log = vineData.data.records;
    //     for (var i = 0; i < 9 ; i++) {
    //         permalinkUrl = vineData.data.records[i].permalinkUrl;
    //         console.log = vineData.data.records[i];
    //         postId = vineData.data.records[i].postId;
    //         $('#vineMontage').append(_.template(vineView,({"permalinkUrl":permalinkUrl},{"postId":postId},{"tag":tag})));
    //       }
    //     })
    //   }
    // });

var LoginView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn"
  },

  el: "#main-container",

  pet: "zellouisa", // default pet until function available to render first pet of user

  initialize: function() {
    console.log("LoginView initialized");
    self = this;
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();


    Parse.User.logIn(username, password, {
        success: function(user) {
          self.$el.html(''); 
          app_router.navigate('//'+self.pet);
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
        });
        this.$(".login-form button").attr("disabled", "disabled");

        return false;
      },

  render: function() {
      console.log(this.$el);
      console.log($("#login-template").html());
      this.$el.append(_.template($("#login-template").html()));
  }
});

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

var SplashView = Parse.View.extend({

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized");
    this.render();
  },

  render: function() {
    console.log('Main el: ', this.$el);
    console.log('Head el: ', $(this.splashHead));
    $(this.splashHead).html(_.template($("#splash-header-template").html()));
    this.$el.html(_.template($("#splash-template").html()));
    this.$el.addClass('splash');
    $('.log-out').hide();
  }
});

$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {

      "click .log-out"    : "logOut"
    },


    pet: "zellouisa", // default pet until function available to render first pet of user

    initialize: function() {
      self = this;
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        console.log(Parse.User.current().getUsername());
        app_router.navigate('//'+self.pet);
      } else {
        console.log('No user signed in. Proceeding to splash screen.');
        new SplashView();
      }
    },

    logOut: function(e) {
      Parse.User.logOut();
      console.log('Logging out and back to main login');
      $('#main-container').removeClass('splash-main');
      $('#main-container').addClass('standard');
      app_router.navigate('');
      $('#main-header').removeClass('standard');
      new SplashView();
    },

  });

  new AppView;

});
