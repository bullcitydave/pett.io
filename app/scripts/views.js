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

    $('.pic-showcase').imagesLoaded(function() {
      self.masonry;
    });



    // //   // initialize Masonry after all images have loaded
    // mContainer.imagesLoaded(function() {
    //   mContainer.masonry({
    //
    //     itemSelector: '.pic-container'
    //   });
    // });

    mContainer = $('#main-container');
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
    mContainer.masonry({
              columnwidth: 200,
              itemSelector: '.montageSquare'
        });
        didMasonry = true;
        console.log(didMasonry);
  },

  render: function() {

    $('.site-visitor').hide();
    $('.site-user').show();

    var parsePicListView = new ParsePicListView(pet);
    var flickrPicListView = new FlickrPicListView(pet);
    link.doMasonry();


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
              flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_b.jpg';
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
