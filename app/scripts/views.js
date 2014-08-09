var LinkView = Parse.View.extend({

  el: "#main-container",



  initialize: function(tag) {
    self=this;
    console.log('Initializing LinkView. Tag:',tag);
    $(this.el).html('');
    $('body').addClass('whitebg');
    if (!(tag)) {tag = 'zellouisa'};
    $('#pet-header h1').html(tag);
    new ParsePicListView(tag);
    new FlickrPicListView(tag);
    // new VineListView();


  },



  events: {

    "click #about"    : "showProfile"
  },

  showProfile: function(e) {
    new ProfileView();
  }


});



var FlickrPicListView = Parse.View.extend({
    el: "#content",

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
        //     itemSelector: '.flickrPicContainer'
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

              // dimsPromises.push(flickrImg);

            $('#content').append(_.template(flickrView,({"flickrImg":flickrImg})));

              //  console.log(dimsPromises);

            }



            // for (var i = 0; i < 9 ; i++) {
            //     if ($('.montageSquare')[i].clientHeight > $('.montageSquare')[i].clientWidth)
            //     {
            //       console.log('Vertical!');
            //       $(".montageSquare").eq(i).css("border", "solid 2px darkorange");
            //       $(".flickrPicContainer").eq(i).addClass("w2");
            //     }
            // }
        });
      }
    });


var ParsePicListView = Parse.View.extend({

    initialize: function(tag) {
      self=this;
      console.log('Initializing parse pic view. Tag: ',tag);
      this.render(tag);

    },

    render: function(tag) {

      this.container = $('#parseMontage');

      var ppQuery = new Parse.Query(ParsePic);
      ppQuery.equalTo("username", Parse.User.current().getUsername());
      ppQuery.equalTo("petname", tag);

      console.log('ppQuery: ',ppQuery);

      ppQuery.find({
        success: function(results) {
            self.showPics(results);
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
         $('#parse-montage').append(_.template(this.parseView,({"parseImg":results[i].attributes.url})));
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
