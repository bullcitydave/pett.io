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

    defaults:{
      "dateDeath": new Date("12/31/2029"),
      "dateBirth": new Date(),
      "dateAdopted": new Date()
    },


    isLiving: function () {
    return (this.get("dateDeath") === "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)" || this.get("dateDeath") === undefined);
  }

    });

    var ParsePic = Parse.Object.extend("ParsePic", {





    });


    var FlickrPic = Parse.Object.extend("FlickrPic", {

      defaults:{

      }

    });

    var PersonPetTags = Parse.Object.extend("PersonPetTags", {

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

    var Pets = Parse.Collection.extend({

      model:Pet

    });

    thesePets = new Pets();

var ProfileView = Parse.View.extend ({

  el: "#main-container",

  initialize: function(tag) {

    $('#main-container').prepend('<div id="profile-container"></div>');
    this.pet = tag;

    console.log('Getting profile for ', this.pet);

    profile = this;

    nullDateBirth = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";
    nullDateDeath = "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)";
    nullDateAdopted = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";


    $(".pic-showcase").css("opacity", .3);



    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", profile.pet);
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + profile.pet + ". Attempting to render...");
        profile.render(results[0].attributes);

        thesePets.fetch({
        success: function(collection) {
            console.log(collection);
            var thisPet = thesePets.get(results[0].id);
            if(thisPet.get("dateDeath")) {
              console.log(results[0].attributes.name + ': ' + moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
              // printYearMarkers(results[0].attributes.dateBirth,results[0].attributes.dateBirth );
              // var lifeMarkerEl = document.createElement("p");
              // $(lifeMarkerEl).attr('id', "life-marker");
            //  $(lifeMarkerEl).insertAfter($('header h2'));
           $('#life-marker').html(moment(results[0].attributes.dateBirth).year()+ ' - ' + moment(results[0].attributes.dateDeath).year());
            }
        },
        error: function(collection, error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });




        console.log(results[0].attributes);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

    events: {

      'click #close-profile'    : 'closeProfile',
      'click #next-pic'    : 'getBackground'

    },

    closeProfile: function(e) {
      $('#profile-container').remove();
      $('#about').show();
      $('#main-container').css('overflow', 'initial');
      $(".pic-showcase").css("opacity", 1);
      return false;
    },

    getDate: function(parseDate) {
      var parsedDate = moment(parseDate);
      var pettioDate = parsedDate.months().toString() + '-' +  parsedDate.date().toString() + '-' +  parsedDate.year().toString();
      return pettioDate;
    },

    getBackground: function() {
      var profileBackgroundImg = document.images[Math.floor(Math.random() * (document.images.length)) + 1].src;

      $('#profile-container .profile').css('background', ('linear-gradient(to bottom right, rgba(225,140,0,0.45), rgba(234,234,234,0.45)),url(' + profileBackgroundImg + ') no-repeat center center fixed' ));
    },

    render: function(data){
        _.defaults(data, {type: "null",dateBirth: "null",dateDeath: "null",dateAdopted: "null",bio: "null",favoriteTreats: "null",colors: "null",gender: "null",breeds: "null",weight: "null",bodyType: "null"});

        console.log(data);

        if (nullDateBirth.toString() != data.dateBirth.toString()) {data.dateBirth   = profile.getDate(data.dateBirth)}
          else { data.dateBirth = null };

        if (nullDateDeath.toString() != data.dateDeath.toString()) {data.dateDeath   = profile.getDate(data.dateDeath)}
          else { data.dateDeath = null };

        if (nullDateAdopted.toString() != data.dateAdopted.toString()) {data.dateAdopted = profile.getDate(data.dateAdopted)}
          else { data.dateAdopted = null };

        if (data.favoriteTreats != "null") {
          data.favoriteTreats = data.favoriteTreats.toString().split(',').join(', ');
        }
        if (data.colors != "null") {
          data.colors = data.colors.toString().split(',').join(', ');
        }
        if (data.breeds != "null") {
          data.breeds = data.breeds.toString().split(',').join(', ');
        }
        if (data.bodyType != "null") {
          data.bodyType = data.bodyType.toString().split(',').join(', ');
        }

        var profileView = $('#profile-template').html();

        $('#profile-container').html(_.template(profileView,data));

        profile.getBackground();
      }
});

var ImageUploadView = Parse.View.extend ({

el: "#tools",

  initialize: function(pet) {
    this.pet = pet;

    console.log('Loading upload form for', this.pet);
    // $('#main-header').append("<div id='upload-container'></div>");
    this.render(pet);
  },

  events: {

    'click #close-upload'    : 'closeUpload'

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
  },

  closeUpload: function(e) {
    $('#upload-container').hide();
    $('.pic-showcase').masonry({


});
    return false;
  },

});


var BrowseView = Parse.View.extend({

  el: "#main-container",



  initialize: function(tag) {
    user=Parse.User.current() || null;

    browseSelf=this;
    console.log('Initializing browse view');
    $('body').addClass('whitebg');
    $('body').removeClass('splash');
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('#main-container').append("<div id='browse-container'></div>");
    browseSelf.render();


  },


  events: {
    // "click #about"    : "showProfile",
    // "click #upload"   : "imageUploadForm",
    // "click #account"  : "viewAccount"
  },

  render: function() {

    if (user == null) {
      $('.site-user').hide();
    }
    else {
      $('.site-visitor').show();
    }

    var petsQuery = new Parse.Query(Pet);
    petsQuery.select("uniqueName");
    petsQuery.ascending("uniqueName");
    petsQuery.find({
      success: function(results) {

    $('#browse-container').imagesLoaded(function() {
      $('#browse-container').masonry({
            columnwidth: 200,
            itemSelector: '.pet-box'
      });
    });


  for (var i = 0; i < results.length ; i++)
    { console.log(results[i].attributes.uniqueName);
    var petUName = results[i].attributes.uniqueName;
    var ppQuery = new Parse.Query(ParsePic);

    ppQuery.equalTo("petname",petUName);
    ppQuery.first();
    ppQuery.ascending("petname");


    ppQuery.find({
      success: function(results) {
          if (results.length > 0) {
          var petImg = results[0].attributes.url;
          console.log(petImg);
          browseSelf.showPics(results[0]);
        };
      }
    });
  }

  $('#browse-container').masonry({
        columnwidth: 300,
        itemSelector: '.pet-box'
  });


},
  error: function(error) {
          alert('Error!');
        }
      });


},


showPics: function(results) {
   var browseView = $('#browse-template').html();
  //  for (var i = 0; i < results.length ; i++) {
      console.log(results);
      console.log(browseView);
    //
    //  $('#browse-container').append((_.template(browseView),results[i]));
    //  $('#browse-container').append(_.template(browseView),results[i].attributes);
    //
    //  $('#browse-container').append(_.template(browseView),JSON.stringify(results[i]));
    //  $('#browse-container').append(_.template(browseView),JSON.stringify(results[i].attributes));
    // $('#browse-container').append(_.template(browseView,JSON.stringify(results[i].attributes)));
    $('#browse-container').append(_.template(browseView,results.attributes));

  //  }

 }
}) ;

var LinkView = Parse.View.extend({

  el: "body",



  initialize: function(tag) {
    link = this;
    pet=tag;
    didMasonry=false;





    if (Parse.User.current() != null)  {
      user=Parse.User.current().getUsername();
      }
    else
      user = "guest";
    console.log('Initializing LinkView. Tag:',tag);
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    // $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#main-container').append(_.template($('#pet-header-template').html(),({"petName":tag})));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('body').removeClass('splash');
    $('#main-container').append("<div class='pic-showcase'></div>");

    // $('.pic-showcase').imagesLoaded(function() {
    //   self.masonry;
    // });



    // //   // initialize Masonry after all images have loaded
    // mContainer.imagesLoaded(function() {
    //   mContainer.masonry({
    //
    //     itemSelector: '.pic-container'
    //   });
    // });

    // mContainer = $('#main-container');
    //
    // mContainer.imagesLoaded(function() {
    //   mContainer.masonry({
    //         columnwidth: 300,
    //         itemSelector: '.montageSquare'
    //   });
    // });

    // mContainer.imagesLoaded(function() {
    //   mContainer.masonry({
    //         columnwidth: 300,
    //         itemSelector: '.montageSquare'
    //   });
    // });


    this.render();



  },




  //   // initialize Masonry after all images have loaded




  events: {
    "click #about"    : "showProfile",
    "click #upload"   : "imageUploadForm",
    "click h2" : "doMasonry"
    // "click #account"  : "viewAccount"
  },

  doMasonry: function() {
    console.log('Running masonry');
    // mContainer.masonry({
    //           columnwidth: 200,
    //           itemSelector: '.montageSquare'
    //     });


    // or with jQuery

// initialize Masonry after all images have loaded
$('.pic-showcase').imagesLoaded( function() {
  $('.pic-showcase').masonry({
                  columnwidth: 300,
                  itemSelector: '.montageSquare'
            });
  });

    $('.pic-showcase').masonry({

  });


},

  render: function() {

    $('.site-visitor').hide();
    $('.site-user').show();
    $('#browse').css('display','block');

    var parsePicListView = new ParsePicListView(pet);
    var flickrPicListView = new FlickrPicListView(pet);



    // for demo / POC
    // if (pet == 'moksha') {
    //
    //   new VineListView(pet);
    // }
  },

  showProfile: function(e) {
    e.preventDefault();
    $('#about').hide();
    $('#main-container').css('overflow', 'hidden');
    $('#profile-container').css('overflow', 'auto');
    new ProfileView(pet);
    return false;
  },

  imageUploadForm: function(e) {
    e.preventDefault();
    new ImageUploadView(pet);
    return false;
  },

  viewAccount: function(e) {
    app_router.navigate('//account/'+Parse.User.current().getUsername());
    return false;
  }


});

/////////////////////////

var FlickrPicListView = Parse.View.extend({
     el: "#main-container",

    initialize: function() {
      z = this;
      console.log("Initializing FlickrPicListView.");
      // this.flickrPicList = new FlickrPicList;
      this.getFlickr(pet);


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

          // try putting this here
          // mContainer.imagesLoaded(function() {
          //   mContainer.masonry({
          //         columnwidth: 300,
          //         itemSelector: '.montageSquare'
          //   });
          // });

          for (var i = 0; i < 9 ; i++) {
            if (!photoData.photos.photo[i]) {
              continue;
            }
              photoId = photoData.photos.photo[i].id;
              farmId = photoData.photos.photo[i].farm;
              serverId = photoData.photos.photo[i].server;
              secret = photoData.photos.photo[i].secret;
              flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_z.jpg';
              console.log('Rendering Flickr image: ',flickrImg);
              $('.pic-showcase').append(_.template(flickrView,({"flickrImg":flickrImg})));
            }


            // for (var i = 0; i < 9 ; i++) {
            //     if ($('.montageSquare')[i].clientHeight > $('.montageSquare')[i].clientWidth)
            //       {
            //       console.log('Vertical!');
            //       $(".montageSquare").eq(i).css("border", "solid 2px darkorange");
            //       $(".picContainer").eq(i).addClass("w2");
            //     }
            // }
            // $('.pic-showcase').masonry({


      // });
        });



      },


    getFlickr: function(e) {
      var flickrUser = '';
      var fQuery = new Parse.Query(PersonPetTags);
      console.log('User: ',user);
      console.log('Pet: ',pet);
      // fQuery.equalTo("username", user);  //why do I need this?
      fQuery.equalTo("pet", pet);
      fQuery.find({
        success:function(results) {
          if (results.length > 0) {
            flickrUser = encodeURIComponent(results[0].attributes.flickrUser.trim());
            flickrTag = results[0].attributes.flickrTag;
            z.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + flickrUser + "&tags=" + flickrTag +"&per_page=16&page=1&format=json&nojsoncallback=1";
            console.log("Flickr URL is ", z.flickrApiUrl);
            z.render();
          }
        },
        error:function(error) {
            console.log('No flickr user and tag combo found');
        }
      });
    }
});

/////////////////////////

var ParsePicListView = Parse.View.extend({
    el: "#main-container",

    initialize: function(pet) {
      parseSelf=this;
      console.log('Initializing parse pic view. Pet: ',pet);
      this.render(pet);

    },

    render: function(tag) {



      var ppQuery = new Parse.Query(ParsePic);
      // ppQuery.equalTo("username", Parse.User.current().getUsername());
      ppQuery.equalTo("petname", tag);

      console.log('ppQuery: ',ppQuery);

      ppQuery.find({
        success: function(results) {

          //
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
      // $('.pic-showcase').masonry({
      //
      //
      // });

     }


});


/////////////////////////

var VineListView = Parse.View.extend({

    initialize: function() {
      this.vineList = new VineList;
      this.tag = 'mokshadog';
      this.vineApiUrl = 'http://protected-harbor-8958.herokuapp.com/api/timelines/tags/' + this.tag;
      this.render();

    },



    render: function () {
      tag = this.tag;
      $.getJSON(this.vineApiUrl).done(function(vineData, tag){
        var vineView = $('#vine-template').html();
        console.log = vineData.data.records;
        for (var i = 0; i < 9 ; i++) {
            permalinkUrl = vineData.data.records[i].permalinkUrl;
            console.log = vineData.data.records[i];
            postId = vineData.data.records[i].postId;
            $('.pic-showcase').insertAfter(_.template(vineView,({"permalinkUrl":permalinkUrl},{"postId":postId},{"tag":tag})));
          }
        })
      }
    });

var LoginView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn"
  },

  el: "#main-container",

  initialize: function() {
    console.log("LoginView initialized");
    $('#big-browse').hide();
    $('h2').hide();
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
      $("#signup-username").attr('placeholder','');
      $("#signup-password").attr('placeholder','');
      this.$el.append(_.template($("#login-template").html()));
  }
});

var SignUpView = Parse.View.extend({
  events: {
    "submit form.signup-form": "signUp"
  },

  el: "#main-container",

  initialize: function() {
    console.log("SignUpView initialized");
    $('#browse').hide();
    $('h2').hide();
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
    $("#login-username").attr('placeholder','');
    $("#login-password").attr('placeholder','');
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
    $('body').addClass('whitebg');
    $('body').removeClass('splash');
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

    $('#update-pet').html(_.template($("#add-pet-template").html()));

    $( '#pet-dob' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-doa' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-dod' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });

    $( '#pet-weight').spinner({
      spin: function( event, ui ) {
        if ( ui.value > 150 ) {
          $( this ).spinner( "value", 0 );
          return false;
        } else if ( ui.value < 0 ) {
          $( this ).spinner( "value", 150 );
          return false;
        }
      }
    });
  },



  submitPet: function(e) {
     e.preventDefault();
     var newPet = new Pet ({
      name: $('input#pet-name').val(),
      uniqueName: $('input#pet-name').val().toLowerCase(),
      type: $('select#pet-type').val(),
      bio: $('input#pet-bio').val(),
      person: {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
      },
      dateBirth: new Date($('input#pet-dob').val() || "01/01/1970"),
      dateDeath: new Date($('input#pet-dod').val() || "12/31/2029"),
      dateAdopted: new Date($('input#pet-doa').val() || "01/01/1970"),
      favoriteTreats: $('textarea#pet-treats').val().split(','),
      breeds: $('textarea#pet-breeds').val().split(','),
      colors: $('textarea#pet-colors').val().split(','),
      bodyType: $('textarea#pet-body-type').val().split(','),
      gender: $('input#pet-gender').val(),
      weight: parseInt($('input#pet-weight').val())
     });
     newPet.save().then(function(refreshList) {
      console.log(newPet.name, ' added to database');
      alert('Information for ' + newPet.name + ' saved');
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

    x.pet = pet;

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
            $(e.toElement).siblings('#set-default').addClass('not-default');
            $(e.toElement).siblings('#set-default').removeClass('default');
            $(e.toElement).siblings('#set-default').html("Set as default");
            $(e.toElement).addClass('default');
            $(e.toElement).removeClass('not-default');
            $(e.toElement).html("Default Pet");
            },

          error: function(myUser) {
            console.log('Could not determine default pet of ', myUser);
          }
        });
    } });
  },


  render: function() {

    $('.site-visitor').hide();
    $('#upload').hide();
    $('#account').addClass('active');
    $('#account').siblings().removeClass('active');


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
               $('#' + results[i].attributes.name).next().next().next().next().addClass('default');
               $('#' + results[i].attributes.name).next().next().next().next().html("Default Pet");
           }
            $('<option>').val(results[i].attributes.name).text(results[i].attributes.name)
               .appendTo('#pet-names');
         }
      },
      error:function(error) {
        console.log('No default pet found');
      }
    });
  },


    //  e.preventDefault();
    //  var pptQuery = new Parse.Query(PersonPetTags);
    //  user = Parse.User.current();
    //  console.log('user: ', user);
    //  pptQuery.equalTo("username",user);
    //  pptQuery.equalTo()
    //       success: function(results) {
    //         results.set("flickrUser", $("input#flickr-account").val());
    //         var tag = $("input#flickr-tag").val();
    //         var pet = $("select#pet-names").val();
    //         var flickrPetTag = {pet:tag};
    //         // flickrPetTag = {$("input#flickr-tag").val():$("selection#pet-names").val()};
    //         results.set("flickrTag", flickrPetTag);
    //         results.save();
    //         alert('Did I save ', flickrPetTag);
    //        },
    //       error:function(error) {
    //         console.log('Could not set Flickr account');
    //       }
    //   });
    setFlickr: function(e) {
      var newPetPersonTag = new PersonPetTags ({
       username: Parse.User.current().getUsername(),
       pet: $("select#pet-names").val().toLowerCase(),
       flickrUser: $('input#flickr-account').val(),
       flickrTag: $('input#flickr-tag').val()
     });

      newPetPersonTag.save().then(function() {
       alert('Flickr user ' + $("input#flickr-account").val() + ' and Flickr tag ' + $("input#flickr-tag").val() + ' added for ' + $("select#pet-names").val());
       console.log('Flickr user ' + $("input#flickr-account").val() + ' and Flickr tag ' + $("input#flickr-tag").val() + ' added to database for pet ' + $("select#pet-names").val());
       }, function(error) {
       console.log('Error adding Flickr tag');
     });
   },


  getFlickr: function(e) {
// this is only get first tag listed for now until UI is reconfigured;
    var flickrUser = '';
    var fQuery = new Parse.Query(PersonPetTags);
    fQuery.equalTo("username", Parse.User.current().getUsername());
    // fQuery.equalTo("pet", x.pet);
    fQuery.find({
      success:function(results) {
        if (results[0].attributes.flickrUser && results[0].attributes.flickrTag) {
          APP.flickrUser = results[0].attributes.flickrUser;
          APP.flickrTag = results[0].attributes.flickrTag;
          $("input#flickr-account").val(results[0].attributes.flickrUser);
          $("input#flickr-tag").val(results[0].attributes.flickrTag);
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
    ':petName'        :     'getPet',




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
    $('body').addClass('splash');
    $('body').removeClass('whitebg');
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
        // "click #about"    : "showProfile",
        // "click #upload"   : "imageUploadForm",
        // "click #account"  : "viewAccount"
      },


    initialize: function() {
      self = this;

    



      // self.masonryContainer = $('.pic-showcase').masonry();


      userType = "visitor";

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
      app_router.navigate('/');
      $('#main-header').removeClass('standard');
      new SplashView();
    }


  });

  window.APP = new AppView;

});
