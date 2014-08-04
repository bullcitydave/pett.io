var LinkView = Parse.View.extend({
  initialize: function() {
    new FlickrPicListView();
    new VineListView();
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
      this.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + flickrUserId + "&tags=moksha&per_page=16&page=1&format=json&nojsoncallback=1";
      this.render();

    },



    render: function () {
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
    }


});


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
            $('#vineMontage').append(_.template(vineView,({"permalinkUrl":permalinkUrl},{"postId":postId},{"tag":tag})));
          }
        })
      }
    });


//
// (function() {
//   var timeoutID = window.setInterval(startAnimation(),10500);
// })();
