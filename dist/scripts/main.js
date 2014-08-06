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

        defaults:{

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

var LinkView = Parse.View.extend({

  el: ".content",

  initialize: function() {
    new FlickrPicListView();
    // new VineListView();
    new ParsePicListView();

  },



  events: {
    "click .log-out": "logOut"
  },



  logOut: function(e) {
    Parse.User.logOut();
    console.log('Logging out and back to main login');
    new LogInView();
    this.undelegateEvents();
    delete this;
  }
});



var FlickrPicListView = Parse.View.extend({

    initialize: function() {
      this.flickrPicList = new FlickrPicList;
      this.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + flickrUserId + "&tags=aremid&per_page=16&page=1&format=json&nojsoncallback=1";
      this.render();

    },



    render: function () {
      //
      // $('.montageSquare').bind('load', function() {
      // console.log('height ', $('.montageSquare').clientHeight);
      // console.log('width ',  $('.montageSquare').clientWidth);
      // });


        var container = $('#flickrMontage');

        // container.masonry({
        //     columnWidth: 40,
        //     itemSelector: '.flickrPicContainer'
        //   });
        //   var msnry = container.data('masonry');
        //   console.log(msnry);

      var dims=[];
      $.getJSON(this.flickrApiUrl + "&format=json&nojsoncallback=1").done(function(photoData){
          var flickrView = $('#flickr-template').html();
          var flickrImg = '';
          var photoId = '';
          var farmId='';
          var serverId ='';
          var secret='';

          var dimsPromises=[];
          for (var i = 0; i < 15 ; i++) {
            if (!photoData.photos.photo[i]) {
              continue;
            }
              photoId = photoData.photos.photo[i].id;
              farmId = photoData.photos.photo[i].farm;
              serverId = photoData.photos.photo[i].server;
              secret = photoData.photos.photo[i].secret;
              flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_b.jpg';

              // dimsPromises.push(flickrImg);

            $('#flickrMontage').append(_.template(flickrView,({"flickrImg":flickrImg})));

              //  console.log(dimsPromises);


               console.log('height: ', $('.montageSquare')[i].clientHeight);
               console.log('width: ', $('.montageSquare')[i].clientWidth);
            }
            for (var i = 0; i < 15 ; i++) {
                if ($('.montageSquare')[i].clientHeight > $('.montageSquare')[i].clientWidth)
                  {
                    console.log('Vertical!');
                    $(".montageSquare").eq(i).css("border", "solid 2px darkorange");
                    $(".flickrPicContainer").eq(i).addClass("w2");
                  }
                }



      });




      // getDims : function() {
      //   for (var i = 0; i < 9 ; i++) {
      //     console.log($('.montageSquare'));
      //     x = $('.montageSquare');
      //     console.log(x.clientWidth);
      //   };
      // }

  }
});



var VineListView = Parse.View.extend({
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
    });


//
// (function() {
//   var timeoutID = window.setInterval(startAnimation(),10500);
// })();





var ParsePicListView = Parse.View.extend({

    collection: ParsePicList,

    initialize: function() {
      this.render();

    },



    //
  render: function () {
      this.collection = new ParsePicList;
      this.container = $('#parseMontage');

      this.collection.query = new Parse.Query(ParsePic);

      this.collection.query.find({
        success: function(results) {
            showPics(results);
        },

        error: function(error) {
            alert('Error!');
          }
        });



    function showPics(results) {
       this.parseView = $('#parse-pic-template').html();
       for (var i = 0; i < results.length ; i++) {
           console.log(results[i]);
      //         serverId = photoData.photos.photo[i].server;
      //         secret = photoData.photos.photo[i].secret;
      //         flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_b.jpg';
console.log(results[i].attributes.url);
console.log(this.parseView);  $('#parseMontage').append(_.template(this.parseView,({"parseImg":results[i].attributes.url})));
      //
      //         //  console.log(dimsPromises);
      //
      //
      //          console.log('height: ', $('.montageSquare')[i].clientHeight);
      //          console.log('width: ', $('.montageSquare')[i].clientWidth);
            // ----
      //       for (var i = 0; i < 15 ; i++) {
      //           if ($('.montageSquare')[i].clientHeight > $('.montageSquare')[i].clientWidth)
      //             {
      //               console.log('Vertical!');
      //               $(".montageSquare").eq(i).css("border", "solid 2px darkorange");
      //               $(".flickrPicContainer").eq(i).addClass("w2");
      //             }
      //           }
      //
      //
      //
    };
  };





      // getDims : function() {
      //   for (var i = 0; i < 9 ; i++) {
      //     console.log($('.montageSquare'));
      //     x = $('.montageSquare');
      //     console.log(x.clientWidth);
      //   };
      // }


}
});

var LogInView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn",
    "submit form.signup-form": "signUp"
  },

  el: ".content",

  initialize: function() {
    _.bindAll(this, "logIn", "signUp");
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();


    Parse.User.logIn(username, password, {
        success: function(user) {
          new LinkView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
        });
        this.$(".login-form button").attr("disabled", "disabled");

        return false;
      },

  signUp: function(e) {
    var self = this;
    var username = this.$("#signup-username").val();
    var password = this.$("#signup-password").val();

    Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
          success: function(user) {
            new LinkView();
            console.log(self);
            self.undelegateEvents();
            delete self;
          },

          error: function(user, error) {
            self.$(".signup-form .error").html(error.message).show();
            self.$(".signup-form button").removeAttr("disabled");
          }
        });

    this.$(".signup-form button").attr("disabled", "disabled");

    return false;
  },

  render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
  }
});

var AppRouter = Parse.Router.extend({
    routes: {


             'login'           :     'goLogin',
             'home'            :     'goLanding',
             'aremid'          :     'goPetzPage',
             'zellouisa'       :     'goPetzPagez',
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

$(function() {





  var AppView = Parse.View.extend({

    el: $("#main-container"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        console.log(Parse.User.current());
        new LinkView();
      } else {
        console.log('login view needed...');
        new LogInView();
      }
    },


    displayMessage: function(txt) {
      $('.display-message').show.html(txt);

    }
});

    new AppView;


  // Parse.history.start();   throwing error - Parse.history is undefined

 /// image upload


 $(function() {
    var file;

    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function() {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", '9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC');
          request.setRequestHeader("X-Parse-REST-API-Key", 'qgbJ6fvbU3byB3RGgWVBsXlLSrqN96WMSrfgFK2n');
          request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: file,
        processData: false,
        contentType: false,
        success: function(data) {
          console.log("File available at: " + data.url);
          var newPic = new ParsePic ({
            url: data.url,
            username: Parse.User.current().getUsername(),
            petname: $('h1').html(),
            source: 'parse'
          });
          newPic.save();
            alert('Photo has been successfully uploaded');
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });
    });


  });

});
