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
          new FlickrPicListView();
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
            new FlickrPicListView();
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
  console.log('this.$el is ',this.$el);
  console.log('template result is ',_.template($("#login-template").html()));  this.$el.html(_.template($("#login-template").html()));
    this.delegateEvents();
  }
});




var FlickrPicListView = Parse.View.extend({
    // events, binders, filters
    initialize: function() {
      this.flickrPicList = new FlickrPicList;
    },

    el: ".content",

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

// LOAD FLICKR VARIABLES
var apiKey = "806745a8a5db2aff0b0cdb591b633726";

var flickrUserID = 'toastie97';

// var flickrApiUrl = "https://api.flickr.com/services/rest?method=flickr.favorites.getPublicList&api_key=" + apiKey + "&user_id=" + flickrUserID + "&safe_search=1&per_page=20";

var flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey + "&user_id=" + flickrUserID + "&tags=moksha&per_page=16&page=1&format=json&nojsoncallback=1";
console.log("API call to ", flickrApiUrl);

// LOAD FLICKR COLLAGE





$.getJSON(flickrApiUrl + "&format=json&nojsoncallback=1").done(function(photoData){
    var flickrView = $('#flickr-template').html();
    var flickrImg = '';
    var photoId = '';
    var farmId='';
    var serverId ='';
    var secret='';
    for (var i = 0; i < 12 ; i++) {
      if (!photoData.photos.photo[i]) {
        continue;
      }
        photoId = photoData.photos.photo[i].id;
        farmId = photoData.photos.photo[i].farm;
        serverId = photoData.photos.photo[i].server;
        secret = photoData.photos.photo[i].secret;
        flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '.jpg';
        $('#flickrMontage').append(_.template(flickrView,({"flickrImg":flickrImg})));



      }


  }).done( function () {
    for (var i = 0; i < 12 ; i++) {
    var h = $('.montageSquare')[i].height;
      var w = $('.montageSquare')[i].width;
      console.log('image ' + i + ' width x height: ' + w+ ' x ' + h);
    }
      console.log ('Done');});

/// VINE

/// VINE VARIABLES
var tag = 'mokshadog';
var vineApiUrl = 'http://protected-harbor-8958.herokuapp.com/api/timelines/tags/' + tag;


$.getJSON(vineApiUrl).done(function(vineData, tag){
  var vineView = $('#vine-template').html();
  console.log = vineData.data.records;
  for (var i = 0; i < 12 ; i++) {
      permalinkUrl = vineData.data.records[i].permalinkUrl;
      console.log = vineData.data.records[i];
      postId = vineData.data.records[i].postId;
      $('#vineMontage').append(_.template(vineView,({"permalinkUrl":permalinkUrl},{"postId":postId},{"tag":tag})));
    }
  });


//
// (function() {
//   var timeoutID = window.setInterval(startAnimation(),10500);
// })();
