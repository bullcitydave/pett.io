var LinkView = Parse.View.extend({

  el: "body",



  initialize: function(tag) {

    document.title = 'pett.io - ' + tag;

    link = this;
    pet=tag;
    didMasonry=false;
    imgCount = 0;


    if (Parse.User.current() != null)  {
      user=Parse.User.current().getUsername();
      }
    else {
      user='';
    }

    console.log('Initializing LinkView. Tag:',tag);
    $('body').css('background','#111');
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').removeClass('browse');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#main-container').append(_.template($('#pet-header-template').html(),({"petName":tag})));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('body').removeClass('splash');

    APP.getAge(pet);

    $('#main-container').append("<div class='pic-showcase'></div>");


    this.render();



  },




  events: {
    "click #about"    : "showProfile",
    "click #upload"   : "imageUploadForm",
    "click h2" : "doMasonry"
  },


  doMasonry: function() {

    $('.pic-showcase').imagesLoaded( function() {
      $('.pic-showcase').masonry({
                      columnwidth: 200,
                      gutter: 10,
                      itemSelector: '.montageSquare',
                      isFitWidth: true,
                      transitionDuration: 0
                });
      // console.log('Total images rendered: ' + $('img').length + ' out of ' + imgCount);

      });

  },


  render: function() {
    if (Parse.User.current() !== null)
      {
        $('.site-visitor').hide();
        $('.site-user').show();
      }
    else {
        $('.site-user').hide();
        $('.site-visitor').show();
    }
    $('#browse').css('display','block');

    var parsePicListView = new ParsePicListView(pet);
    var flickrPicListView = new FlickrPicListView(pet);


      function imageLoadCheck() {
        var c = 0;
        for (i = 0; i < $('img').length; i++) {
          if ($('img')[i].complete) { c++; }
        }
        return c;
      }

    var complete = 0;

    var buildingImages = setInterval(function(){
        complete = imageLoadCheck();
        // console.log('Percent loaded: ', (complete/imgCount)*100);
        link.doMasonry()},750);

    setTimeout(function(){
      clearInterval(buildingImages)},15000);


},

  showProfile: function(e) {
    e.preventDefault();
    $('#about').hide();
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
      this.getFlickr(pet);


    },



    render: function () {
      $.getJSON(z.flickrApiUrl + "&format=json&nojsoncallback=1").done(function(photoData){
          flickrLength = Math.min(photoData.photos.photo.length,15);
          imgCount = imgCount + flickrLength;
          console.log('Flickr images: ' + flickrLength + ' Total images rendered: ' + imgCount);
          var flickrView = $('#flickr-template').html();
          var flickrImg = '';
          var photoId = '';
          var farmId='';
          var serverId ='';
          var secret='';



          for (var i = 0; i < flickrLength ; i++) {
            if (!photoData.photos.photo[i]) {
              continue;
            }
              photoId = photoData.photos.photo[i].id;
              farmId = photoData.photos.photo[i].farm;
              serverId = photoData.photos.photo[i].server;
              secret = photoData.photos.photo[i].secret;
              flickrImg = 'https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + photoId + '_'+ secret + '_n.jpg';
              flickrUrl = 'https://www.flickr.com/photos/' + z.flickrUser + '/' + photoId + '/';
              // console.log('Rendering Flickr image: ',flickrImg);
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
      z.flickrUser = '';
      var fQuery = new Parse.Query(PersonPetTags);
      fQuery.equalTo("pet", pet);
      fQuery.find({
        success:function(results) {
          if (results.length > 0) {
            z.flickrUser = encodeURIComponent(results[0].attributes.flickrUser.trim());
            flickrTag = results[0].attributes.flickrTag;
            z.flickrApiUrl =  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey + "&user_id=" + z.flickrUser + "&tags=" + flickrTag +"&per_page=16&page=1&format=json&nojsoncallback=1";
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



      var ppQuery1 = new Parse.Query(ParsePic);
      ppQuery1.equalTo("petname", tag);
      ppQuery1.equalTo("size","original");

      var ppQuery2 = new Parse.Query(ParsePic);
      ppQuery2.equalTo("petname", tag);
      ppQuery2.doesNotExist("size");

      var ppQuery =  new Parse.Query.or(ppQuery1, ppQuery2);
      ppQuery.descending("createdAt");

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
       imgCount = imgCount + results.length;
      //  console.log('Parse images: ' + results.length + ' Total images rendered: ' + imgCount);
       this.parseView = $('#parse-pic-template').html();
       for (var i = 0; i < results.length ; i++) {
          // console.log(results[i]);
          // console.log(results[i].attributes.url);
          // console.log(this.parseView);
         $('.pic-showcase').append(_.template(this.parseView,({"parseImg":results[i].attributes.medium._url,"fullURL":results[i].attributes.url})));
       };


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
