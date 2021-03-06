var LinkView = Parse.View.extend({

  el: "body",

  model: Pet,



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
    APP.header.addClass('standard');
    APP.main.removeClass('splash');
    APP.main.addClass('standard');
    APP.main.removeClass('browse');
    APP.main.html('');
    $('.pic-showcase').html('');

    APP.header.html(_.template($('#header-template').html(),({"userName":user})));

    $('#log-out').show();
    $('body').addClass('whitebg');
    $('body').removeClass('splash');

    APP.main.append("<div class='pic-showcase'></div>");

    // this.pet = new Pet();

    // this.collection.fetch({reset: true}); // NEW
    // this.render();

    // myPetPromise = APP.getPet(pet);
    // APP.getPet(pet).then(function(r) {
    //   link.render();
    // });
    // this.render();

    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", pet);
    query.find().then(function(result) {
      link.pet = new Pet(result[0].attributes);
      link.navbarSetup();
      link.render();
    });


    // myPet = APP.getPet(tag);
    //
    // this.render();

    $(window).on("resize", this, function(){
      link.squeeze($('.pic-showcase a'));
      })



  },




  events: {
    "click #about"         : "showProfile",
    "click #upload"        : "imageUploadForm",
    "click #remove"        : "removeImagesOptions",
    "mouseover .fa-close"  : "highlightImageOn",
    "mouseout .fa-close"   : "highlightImageOff",
    "click .fa-close"      : "selectImageToRemove",
    "click .pic-showcase a": "selectImage",
    "click #remove-images #done": "removeImages"

  },

  navbarSetup : function() {
    if (Parse.User.current() !== null) {
        $('.site-visitor').hide();
        $('.site-user').show();
        if (Parse.User.current().get("username") != (link.pet).get("person").id) {
          $('#header-nav #account').hide();
          $('#header-nav #manage-images').hide();
        }
        else {
          $('#header-nav #account').show();
          $('#header-nav #manage-images').show();
        }
      }
    else {
        $('.site-user').hide();
        $('.site-visitor').show();
    }
  },


  // doMasonry: function() {
  //
  //   $('.pic-showcase').imagesLoaded( function() {
  //     $('.pic-showcase').masonry({
  //                     columnwidth: 200,
  //                     gutter: 10,
  //                     itemSelector: '.montageSquare',
  //                     isFitWidth: true,
  //                     transitionDuration: 0
  //               });
  //     // console.log('Total images rendered: ' + $('img').length + ' out of ' + imgCount);
  //
  //     });
  //
  // },


  render: function() {

    $('#browse').css('display','block');
    var name = (link.pet).get("name");

    APP.main.append(_.template($('#pet-header-template').html(),({"petName":name})));
    APP.getAge(link.pet);

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
        link.squeeze($('.pic-showcase a'))},1250);

    setTimeout(function(){
      clearInterval(buildingImages)},12500);


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

  removeImagesOptions: function(e){
    e.preventDefault();
    $('.pic-showcase').addClass('edit');
    $('i.fa-close').show();
    $('#tools').show();
    $('#tools-container').show();
    $('#modals-template').load("_modals.html", function () {
      $('#tools-container').html($('#modals-template').html());
    });
    return false;
  },

  removeImagesOptionsDone: function(){
    $('.pic-showcase').removeClass('edit');
    $('i.fa-close').hide();
    $('#tools').hide();
    $('#tools-container').hide();
    $('#modals-template').load("_modals.html", function () {
      $('#tools-container').html($('#modals-template').html());
    });
  },

  viewAccount: function(e) {
    app_router.navigate('//account/'+Parse.User.current().getUsername());
    return false;
  },

  squeeze: function(el) {
    // console.log('Squeezing...');
    var rowWidth = 0;
    var A = [];
    var width = window.innerWidth;
    var insertAfter;
    var insertThis;
    for (i = 0; i < $(el).length; i++ ) {
        A[i] = ($(el).eq(i).width())+8;

        if ((rowWidth + A[i]) > width) {
          var insertAfter = $(el).eq(i-1);
          var extraSpace = width - rowWidth;
          for (j = i; j < $('.pic-showcase a').length; j++) {
            if (($(el).eq(j).width()+8) < extraSpace) {
              // console.log(j + ' ' + $('.pet-box').eq(j).width());
              var insertThis = $(el).eq(j);
              insertThis.insertAfter(insertAfter).before(" ");
              link.squeeze($('.pic-showcase a'));
              return false;
             }
           }
           rowWidth = A[i];
          //  console.log('rowWidth: ', rowWidth);
        }
        else {
          rowWidth += A[i];
          // console.log('rowWidth: ', rowWidth);
        }
    }
  },

  highlightImageOn: function(e) {
      $(e.target).siblings('img').addClass('hover');
  },

  highlightImageOff: function(e) {
      $(e.target).siblings('img').removeClass('hover');
  },

  selectImage: function(e) {
    if (document.querySelector('#remove-images') != null) {
      e.preventDefault();
      $(e.target).parent().toggleClass('selected');
      return false;
    }
  },

  selectImageToRemove: function(e) {
    e.preventDefault();
    $(e.target).siblings('a').toggleClass('selected');
  },

  removeImages: function(e) {
    e.preventDefault();
    var numSelected = $('.pic-showcase a.selected').length;
    if (numSelected > 0) {
      var selected = [];
      $('.pic-showcase a.selected').each(function() {
        selected.push(this.id);
        $(this).remove();
      })

      var status =  ($('#remove-images input[name=archive]:checked').val() === "true") ? 3 : 9;
      var action =  ($('#remove-images input[name=archive]:checked').val() === "true") ? 'archive' : 'delete';

      var imgId = $(e.target).parent().attr('id');
      $(e.target).parent().remove();
      var rQuery = new Parse.Query(ParsePic);
      rQuery.containedIn("objectId", selected);
      rQuery.each(function(result) {
        result.set("status",status);
        return result.save();
      }).then(function() {
          alert(numSelected > 1 ? numSelected + ' images ' + action + 'd' : numSelected + ' image ' + action + 'd');
        }, function(err) {
            console.log(err);
            alert('Problem archiving images. No images have been lost. Refresh to try again.');
      })
    }
    link.removeImagesOptionsDone();
  },




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
      ppQuery1.equalTo("petUniqueName", tag);
      ppQuery1.notEqualTo("status", 3);
      ppQuery1.equalTo("size","original");

      var ppQuery2 = new Parse.Query(ParsePic);
      ppQuery2.equalTo("petUniqueName", tag);
      ppQuery2.notEqualTo("archived", true);
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
         $('.pic-showcase').append(_.template(this.parseView,({"parseImg":results[i].attributes.medium._url,"fullURL":results[i].attributes.url,"picID":results[i].id})));
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
