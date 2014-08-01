// LOAD FLICKR VARIABLES
var apiKey = "806745a8a5db2aff0b0cdb591b633726";

var flickrUserID = '125739404@N08';

// var flickrApiUrl = "https://api.flickr.com/services/rest?method=flickr.favorites.getPublicList&api_key=" + apiKey + "&user_id=" + flickrUserID + "&safe_search=1&per_page=20";

var flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f0d1c3a1af34340afb9f07a98a5764d&user_id=toastie97&tags=moksha&per_page=16&page=1&format=json&nojsoncallback=1&auth_token=72157646088307324-96e2e58d93f54a9f&api_sig=9f50c252c4f28926cc5127cfa3677dbc";

// LOAD FLICKR COLLAGE


 function startAnimation() {
     var random = Math.round(Math.random()*12);
    $('.montageSquare:eq('+random+')').css({opacity: 1.0});
     var random2 = Math.round(Math.random()*12);
    $('.montageSquare:eq('+random2+')').css({opacity: 0.1});
  }




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
        /*return photoData;*/
      }


  });



(function() {
  var timeoutID = window.setInterval(startAnimation,1500);
})();
