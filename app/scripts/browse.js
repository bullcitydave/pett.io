
var BrowseView = Parse.View.extend({

  el: "#main-container",


  events: {
    "mouseover .pet-pic"    : "hoverBox",
    "mouseout  .pet-pic"    : "leaveBox",
  },

  initialize: function(tag) {

    document.title = 'pett.io - browse';
    if (Parse.User.current() != null) {
       user=Parse.User.current().get("username");
     }
    else {
       user=null;
    }

    APP.header.html(_.template($('#header-template').html(),({"userName":user})));



    browseSelf=this;
    browseSelf.checkUserStatus();
    console.log('Initializing browse view');
    $('body').css('background','none');
    $('body').addClass('darkBg');
    $('body').removeClass('splash');
    APP.header.addClass('standard');
    APP.header.removeClass('splash');
    $('#header-nav').css("display","block");
    APP.main.removeClass('splash');
    APP.main.addClass('standard');
    APP.main.addClass('browse');
    APP.main.html('');
    $('.pic-showcase').html('');
    // $('#tools').html('');
    if (user != null) {APP.header.html(_.template($('#header-template').html(),({"userName":user})));};
    $('#browse').hide();
    $('#log-out').show();
    $('body').addClass('darkbg');
    APP.main.append("<div id='browse-container'></div>");

    var parsePicQuery = new Parse.Query("ParsePic");
    parsePicQuery.limit(1000);
    parsePicQuery.descending('createdAt');
    parsePics = parsePicQuery.collection();


    d = new $.Deferred();
    browseSelf.render();

  },

  render: function() {

      parsePics.fetch({
          success: function(collection) {
              browseSelf.getPics(collection);
            },
          error: function(collection, error) {
                console.error(error);
            }
      });

        // var petsQuery = new Parse.Query(Pet);
        // petsQuery.limit(1000);
        // petsQuery.select("uniqueName");
        // petsQuery.descending("updatedAt");
        // petsQuery.find({
        //   success: function(results) {

      //         return this;
      //       },
      //     error: function(error) {
      //         console.log("Error: " + error.code + " " + error.message);
      //     }
      // });
      return this;
  },

  getPics: function(collection) {


      var names = collection.pluck('petUniqueName');
      var uniqueNames = _.countBy(names);
      browseSelf.imageCount = Object.keys(uniqueNames).length;
      $(document).on("load", ".pet-box[Object.keys(uniqueNames.length)]", function(){
        browseSelf.squeeze();
        })
      var petPics = collection.models;

      _.each(Object.keys(uniqueNames), function(name){
        // console.log(name + "--" + uniqueNames[name]);
        // var petPhotos = _.where(collection)
        var petPics = collection.filter(function(petPic) {
          return petPic.get('petUniqueName') === name; });
        var numPics = uniqueNames[name];
        var randomPic = Math.floor(Math.random() * numPics);
        browseSelf.showPics(petPics[randomPic]);
      })

      // browseSelf.squeeze();

      //
      // var randomImg = Math.floor(Math.random() * (results.length));



      //
      // d1 = new $.Deferred();
      // $.when(d1).done(function () {
      //   browseSelf.squeeze();
      // });
      // var petsWithPicsCount = 0;
      // for (var i = 0; i < results.length ; i++){
          // var petUName = results[i].attributes.uniqueName;
          // var ppQuery = new Parse.Query(ParsePic);
          // ppQuery1.matchesKeyInQuery("hometown", "uniqueName", results);
          // ppQuery1.equalTo("petUniqueName",petUName);
          // ppQuery1.containedIn("size",
          //             ["original", "undefined"]);
          //
          // var ppQuery2 = new Parse.Query(ParsePic);
          // ppQuery2.equalTo("petUniqueName",petUName);
          // ppQuery2.doesNotExist("size");
          //
          // var ppQuery =  new Parse.Query.or(ppQuery1, ppQuery2);
          //
          // ppQuery.ascending("petname");

          // ppQuery.find({
          //   success: function(results) {
          //       if (results.length > 0) {
          //         // petsWithPicsCount +=1;
          //         var randomImg = Math.floor(Math.random() * (results.length));
          //         browseSelf.showPics(results[randomImg], petsWithPicsCount);
          //     };
          //   }
          // });
      // };
      return this;
  },


  showPics: function(results) {
      var browseTemplate = $('#browse-template').html();
      $('#browse-container').append(_.template(browseTemplate,results.attributes));
      var imgLoad = imagesLoaded('#browse-container');
      imgLoad.on( 'always', function() {
        // console.log( imgLoad.images.length + ' images loaded' );
        if (imgLoad.images.length === browseSelf.imageCount) {
          browseSelf.squeeze();
        };
    // detect which image is broken
    // for ( var i = 0, len = imgLoad.images.length; i < len; i++ ) {
    //   var image = imgLoad.images[i];
    //   var result = image.isLoaded ? 'loaded' : 'broken';
    //   // console.log( 'image is ' + result + ' for ' + image.img.src );
    // }
  });
      // if (petCount === 10) { d1.resolve(); };
  },


  hoverBox: function(event) {
      // $('.hovering').removeClass('hovering');
      var targetBox = $(event.target).parent().parent();
      targetBox.addClass('hovering');
      // need separate for 1st el, top x els, last of row 1
      // bottom left, bottom, bottom-right
      // left, right
      // everything else
      if ((targetBox.position().top < 100)) {
        targetBox.switchClass('hovering','hovering-down');
      }
      if ((targetBox.parent().height() - targetBox.position().top) < 300) {
        targetBox.switchClass('hovering','hovering-up');
      }

  },

  leaveBox: function(event) {
      var targetBox = $(event.target).parent().parent();
      // $('*[class*="hovering"]').removeClass('hovering hovering-up hovering-down');
      targetBox.removeClass('hovering hovering-up hovering-down');
  },

  checkUserStatus: function() {
      if (Parse.User.current() !== null)
        {
          $('.site-visitor').hide();
          $('.site-user').show();
        }
      else {
          $('.site-user').hide();
          $('.site-visitor').show();
      }
  },

  squeeze: function() {
    // console.log('Squeezing...');
    var rowWidth = 0;
    var A = [];
    var width = window.innerWidth;
    var insertAfter;
    var insertThis;
    for (i = 0; i < $('.pet-box').length; i++ ) {
        A[i] = ($('.pet-box').eq(i).width())+38;

        if ((rowWidth + A[i]) > width) {
          insertAfter = (i-1);
          var extraSpace = width - rowWidth;
          // console.log('extraspace ', extraSpace);
          for (j = i; j < $('.pet-box').length; j++) {
            if (($('.pet-box').eq(j).width()+38) < extraSpace) {
              // console.log(j + ' ' + $('.pet-box').eq(j).width());
              insertThis = j;
              $('.pet-box').eq(insertThis).insertAfter($('.pet-box').eq(insertAfter));
              browseSelf.squeeze();
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
  }



});
