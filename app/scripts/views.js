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
