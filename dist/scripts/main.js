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

  el: "#pet-header",

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

    events: {

      'click #close-profile'    : 'closeProfile'

    },

    closeProfile: function(e) {
      $('#profile-container').html('');
      $('#profile-container').hide();
      return false;
    },

    render: function(data){
        _.defaults(data, {type: "null",dateBirth: "null",dateDeath: "null",dateAdopted: "null",bio: "null",favoriteTreats: "null",colors: "null"});
        var profileView = $('#profile-template').html();
        $('#profile-container').show();
        $('#profile-container').html(_.template(profileView,data));
      }
});

var ImageUploadView = Parse.View.extend ({


  initialize: function(pet) {
    this.pet = pet;

    console.log('Loading upload form for', this.pet);

    this.render(pet);
  },

    render: function(pet){
        $('#upload-container').html($('#image-upload-template').html());

// from: https://parse.com/questions/uploading-files-to-parse-using-javascript-and-the-rest-api

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
            petname: pet,
            source: 'parse'
          });
          newPic.save();
            alert('Photo has been successfully uploaded. Refresh the page to view the image in the gallery.');
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });
    });
  }
});

var LinkView = Parse.View.extend({

  el: "body",

  initialize: function(tag) {
    if (!(tag)) {tag = 'zellouisa'};
    pet=tag;
    user=Parse.User.current().getUsername();
    console.log('Initializing LinkView. Tag:',tag);
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#main-container').append(_.template($('#pet-header-template').html(),({"petName":tag})));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('#main-container').append("<div class='pic-showcase'></div>");

    var mContainer = $('.pic-showcase');


    // //   // initialize Masonry after all images have loaded
    // mContainer.imagesLoaded(function() {
    //   mContainer.masonry({
    //
    //     itemSelector: '.pic-container'
    //   });
    // });

  // mContainer.masonry({
  //   columnWidth: 200,
  //   itemSelector: '.pic-container'
  // });

    // var mContainer = $('.pic-showcase');
    //   // initialize Masonry after all images have loaded
    mContainer.imagesLoaded(function() {
      mContainer.masonry({
            columnwidth: 50,
            gutter: 50,
            itemSelector: '.pic-container'


      });
    });

    new ParsePicListView(tag);
    new FlickrPicListView();
  },


  events: {
    "click #about"    : "showProfile",
    "click #upload"   : "imageUploadForm",
    "click #account"  : "viewAccount"
  },

  showProfile: function(e) {
    new ProfileView(pet);
  },

  imageUploadForm: function(e) {
    new ImageUploadView(pet);
  },

  viewAccount: function(e) {
    app_router.navigate('//account/'+Parse.User.current().getUsername());
    return false;
  }


});



var FlickrPicListView = Parse.View.extend({
     el: "#main-container",

    initialize: function() {
      z = this;
      console.log("Initializing FlickrPicListView.");
      // this.flickrPicList = new FlickrPicList;
      this.getFlickr();


    },



    render: function () {
      //
      // $('.montageSquare').bind('load', function() {
      // console.log('height ', $('.montageSquare').clientHeight);
      // console.log('width ',  $('.montageSquare').clientWidth);
      // });



      $.getJSON(z.flickrApiUrl + "&format=json&nojsoncallback=1").done(function(photoData){
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
              $('.pic-showcase').append(_.template(flickrView,({"flickrImg":flickrImg})));
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
      },

      getFlickr: function() {

        var flickrUser = '';
        var fQuery = new Parse.Query(Parse.User);
        fQuery.equalTo("username", Parse.User.current().getUsername());
        fQuery.find({
          success:function(uResults) {
            if (uResults[0].attributes.flickrUser && uResults[0].attributes.flickrTag) {
              flickrUser = encodeURIComponent(uResults[0].attributes.flickrUser.trim());
              flickrTag = uResults[0].attributes.flickrTag;
              z.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + flickrUser + "&tags=" + flickrTag +"&per_page=16&page=1&format=json&nojsoncallback=1";
              console.log("Flickr URL is ", z.flickrApiUrl);
              z.render();
            }
          },
          error:function(error) {
            console.log('No flickr user found');
          }
        });
      }

    });


var ParsePicListView = Parse.View.extend({
    el: "#main-container",

    initialize: function(tag) {
      parseSelf=this;
      console.log('Initializing parse pic view. Tag: ',tag);
      this.render(tag);

    },

    render: function(tag) {



      var ppQuery = new Parse.Query(ParsePic);
      // ppQuery.equalTo("username", Parse.User.current().getUsername());
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
         $('.pic-showcase').append(_.template(this.parseView,({"parseImg":results[i].attributes.url})));
       };
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
          APP.initialize();
          // app_router.navigate('//'+self.pet);
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

var SignUpView = Parse.View.extend({
  events: {
    "submit form.signup-form": "signUp"
  },

  el: "#main-container",

  initialize: function() {
    console.log("SignUpView initialized")
    _.bindAll(this, "signUp");
    this.render();
  },

  signUp: function(e) {
    var self = this;
    var username = this.$("#signup-username").val();
    var password = this.$("#signup-password").val();

    Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
          success: function(user) {
            console.log('Account created for', username);
            app_router.navigate('//account/'+username);
          },

          error: function(user, error) {
            self.$(".signup-form .error").html(error.message).show();
            // self.$(".signup-form button").removeAttr("disabled");
          }
        });

    // this.$(".signup-form button").attr("disabled", "disabled");

    return false;
  },

  render: function() {
    this.$el.append(_.template($("#signup-template").html()));
  }
});

var AccountView = Parse.View.extend({

  el: "#main-container",

  events: {
    "click #add-pet"        : "createPet",
    "submit"                : "submitPet",
    "click #upload-image"   : "imageUploadForm",
    "click #view-page"      : "viewPet",
    "click #set-default"    : "setDefault",
    "click #add-flickr"     : "setFlickr"
  },


  initialize: function() {
    this.user = Parse.User.current().getUsername();
    console.log("Account view initialized");
    $(this.el).removeClass('splash');
    $(this.el).addClass('standard');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":this.user})));
    $('#main-header').addClass('standard');
    $('body').addClass('whitebg');
    x=this;
    _.bindAll(this, "createPet");
    this.render();
  },


  createPet: function(e) {
    $('#add-pet').hide();
    $('.user-profile').append(_.template($("#add-pet-template").html()));
  },


  submitPet: function(e) {
     e.preventDefault();
     var newPet = new Pet ({
      name: $('input#pet-name').val(),
      uniqueName: $('input#pet-name').val().toLowerCase(),
      bio: $('input#bio').val(),
      person: {__type: "Pointer",
      className: "_User",
      objectId: Parse.User.current().getUsername()
      }
     });
     newPet.save().then(function(refreshList) {
      console.log(newPet.name, ' added to database');
      x.render();
      }, function(error) {
      console.log('Error adding pet to database');
      });
    },


  imageUploadForm: function(e) {
    console.log($(e.toElement).prev().prev().prev().html());
    pet = $(e.toElement).prev().prev().prev().html().toLowerCase();
    new ImageUploadView(pet);
  },


  viewPet: function(e) {
    pet = $(e.toElement).prev().html().toLowerCase();
    app_router.navigate('//' + pet);
    return false;
  },


  setDefault: function(e) {
    pet = $(e.toElement).prev().prev().prev().prev().html().toLowerCase();

    console.log('Pet: ', pet);


    var pQuery = new Parse.Query(Pet);
    pQuery.equalTo("uniqueName", pet);
    pQuery.find({
      success:function(results) {
        console.log(results[0].id);
        x.petId = results[0].id;

        user = Parse.User.current();
        console.log('User: ', user);


        var uQuery = new Parse.Query(Parse.User);
        console.log('User id: ', user.id);
        uQuery.get(user.id, {
          success: function(results) {

            results.set("defaultPet",
                {
                  __type: "Pointer",
                  className: "Pet",
                  objectId: x.petId
                });

            results.save();
            console.log('Results: ',results);
            $(e.toElement).siblings('#set-default').css("background-color","inherit");
            $(e.toElement).siblings('#set-default').html("Set as default");
            $(e.toElement).css("background-color","darkorange");
            $(e.toElement).html("Default Pet");
            },

          error: function(myUser) {
            console.log('Could not determine default pet of ', myUser);
          }
        });
    } });
  },


  render: function() {
    this.$el.html(_.template($("#account-template").html(), ({"userName": Parse.User.current().getUsername()})));

    var ppQuery = new Parse.Query(Pet);

    ppQuery.equalTo("person", {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
    });

    console.log('ppQuery: ',ppQuery);

    ppQuery.find({
      success: function(results) {
          console.log('Returning pets:', results);
          if (results.length > 0)  { x.listPets(results); }
      },

      error: function(error) {
          console.log('No pets found');
        }
      });

    x.getFlickr();
    },


  listPets: function(results) {

    var defaultPetId = '';
    var dQuery = new Parse.Query(Parse.User);
    dQuery.equalTo("username", Parse.User.current().getUsername());
    dQuery.find({
      success:function(uResults) {
        if (uResults[0].attributes.defaultPet) {
          defaultPetId = uResults[0].attributes.defaultPet.id;
        }
        for (var i = 0; i < results.length ; i++) {
           console.log(results[i].attributes.name);
           $('#my-pet-list').append(_.template($('#pet-list-template').html(),
           ({name:results[i].attributes.name})));
           if (results[i].id === defaultPetId) {
               console.log('Default is ',results[i].attributes.name);
               $('#' + results[i].attributes.name).next().next().next().next().css("background-color","darkorange");
               $('#' + results[i].attributes.name).next().next().next().next().html("Default Pet");
           }
         }
      },
      error:function(error) {
        console.log('No default pet found');
      }
    });
  },

  setFlickr: function(e) {
     e.preventDefault();
     var uQuery = new Parse.Query(Parse.User);
     user = Parse.User.current();
     console.log('User id: ', user.id);
     uQuery.get(user.id, {
          success: function(results) {
            results.set("flickrUser", $("input#flickr-account").val());
            results.set("flickrTag", $("input#flickr-tag").val());
            results.save();
           },
          error:function(error) {
            console.log('Could not set Flickr account');
          }
      });
  },

  getFlickr: function(e) {

    var flickrUser = '';
    var fQuery = new Parse.Query(Parse.User);
    fQuery.equalTo("username", Parse.User.current().getUsername());
    fQuery.find({
      success:function(uResults) {
        if (uResults[0].attributes.flickrUser && uResults[0].attributes.flickrTag) {
          APP.flickrUser = uResults[0].attributes.flickrUser;
          APP.flickrTag = uResults[0].attributes.flickrTag;
          $("input#flickr-account").val(uResults[0].attributes.flickrUser);
          $("input#flickr-tag").val(uResults[0].attributes.flickrTag);
        }
      },
      error:function(error) {
        console.log('No flickr user found');
      }
    });
  }



});

var AppRouter = Parse.Router.extend({
    routes: {

       'login'           :     'goLogin',
       'signup'          :     'goSignUp',
       'account/:user'   :     'updateAccount',
       'browse'          :     'goBrowse',
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
    $(this.splashHead).html(_.template($("#header-template").html(),({"userName":''})));
    this.$el.html(_.template($("#splash-template").html()));
    this.$el.addClass('splash');
    $('#header-nav').hide();
  }
});

$(function() {

  var AppView = Parse.View.extend({

    el: $("#main-header"),

    events: {
      "click #log-out"    : "logOut"
    },

    initialize: function() {
      self = this;
      if (Parse.User.current()) {
        self.user = Parse.User.current().getUsername();
        console.log(self.user + " is logged in");
        self.render();
      }
      else {
        console.log('No user signed in. Proceeding to splash screen.');
        new SplashView();
      }
    },

    render: function() {

      self.getDefaultPet(self.user);

    },


    getDefaultPet: function() {

      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("username", self.user);
      userQuery.find({

        success: function(results) {
          if (results[0].attributes.defaultPet) {
            defaultPetId = results[0].attributes.defaultPet.id;
            defaultPetQuery = new Parse.Query(Pet);
            defaultPetQuery.get(defaultPetId, {
              success: function(results) {
                self.dp = results.attributes.uniqueName;
                console.log('Default pet: ',self.dp);
                app_router.navigate('//' + self.dp);
                },
              error: function(myUser) {
                console.log('Could not determine default pet value');
                app_router.navigate('//account/'+self.user);
              }
            });
          }
          else {
            app_router.navigate('//account/'+self.user);
          }
        },

        error: function(error) {
            alert('Could not determine default pet value');
            app_router.navigate('//account/'+self.user);
          }
        });
    },

    logOut: function(e) {
      Parse.User.logOut();
      console.log('Logging out and back to main login');
      $('#main-container').removeClass('splash-main');
      $('#main-container').addClass('standard');
      app_router.navigate('');
      $('#main-header').removeClass('standard');
      new SplashView();
    }

  });

  window.APP = new AppView;

});
