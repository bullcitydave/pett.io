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
