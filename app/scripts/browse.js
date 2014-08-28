
var BrowseView = Parse.View.extend({

  el: "#main-container",



  initialize: function(tag) {
    user=Parse.User.current() || null;

    browseSelf=this;
    console.log('Initializing browse view');
    $('body').addClass('darkbg');
    $('body').removeClass('splash');
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#log-out').show();
    $('body').addClass('darkbg');
    $('#main-container').append("<div id='browse-container'></div>");
    browseSelf.render();


  },


  events: {
    // "click #about"    : "showProfile",
    // "click #upload"   : "imageUploadForm",
    // "click #account"  : "viewAccount"
  },

  render: function() {

    if (user == null) {
      $('.site-user').hide();
    }
    else {
      $('.site-visitor').show();
    }

    var petsQuery = new Parse.Query(Pet);
    petsQuery.select("uniqueName");
    petsQuery.ascending("uniqueName");
    petsQuery.find({
      success: function(results) {

    $('#browse-container').imagesLoaded(function() {
      $('#browse-container').masonry({
            columnwidth: 200,
            itemSelector: '.pet-box'
      });
    });


  for (var i = 0; i < results.length ; i++)
    { console.log(results[i].attributes.uniqueName);
    var petUName = results[i].attributes.uniqueName;
    var ppQuery = new Parse.Query(ParsePic);

    ppQuery.equalTo("petname",petUName);
    ppQuery.first();
    ppQuery.ascending("petname");


    ppQuery.find({
      success: function(results) {
          if (results.length > 0) {
          var petImg = results[0].attributes.url;
          console.log(petImg);
          browseSelf.showPics(results[0]);
        };
      }
    });
  }

  $('#browse-container').masonry({
        columnwidth: 300,
        itemSelector: '.pet-box'
  });


},
  error: function(error) {
          alert('Error!');
        }
      });


},


showPics: function(results) {
   var browseView = $('#browse-template').html();
  //  for (var i = 0; i < results.length ; i++) {
      console.log(results);
      console.log(browseView);
    //
    //  $('#browse-container').append((_.template(browseView),results[i]));
    //  $('#browse-container').append(_.template(browseView),results[i].attributes);
    //
    //  $('#browse-container').append(_.template(browseView),JSON.stringify(results[i]));
    //  $('#browse-container').append(_.template(browseView),JSON.stringify(results[i].attributes));
    // $('#browse-container').append(_.template(browseView,JSON.stringify(results[i].attributes)));
    $('#browse-container').append(_.template(browseView,results.attributes));

  //  }

 }
}) ;
