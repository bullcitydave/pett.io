
var BrowseView = Parse.View.extend({

  el: "#main-container",


  events: {
    "mouseover .pet-pic"    : "hoverBox",
    "mouseout  .pet-pic"    : "leaveBox"

  },

  initialize: function(tag) {

    document.title = 'pett.io - browse';
    if (Parse.User.current() != null) {
       user=Parse.User.current().get("username");
     }
    else {
       user=null;
    }

    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));

    browseSelf=this;
    console.log('Initializing browse view');
    $('body').css('background','none');
    $('body').addClass('darkBg');
    $('body').removeClass('splash');
    $('#main-header').addClass('standard');
    $('#main-header').removeClass('splash');
    $('#header-nav').css("display","block");
    APP.main.removeClass('splash');
    APP.main.addClass('standard');
    APP.main.addClass('browse');
    APP.main.html('');
    $('.pic-showcase').html('');
    // $('#tools').html('');
    if (user != null) {$('#main-header').html(_.template($('#header-template').html(),({"userName":user})));};
    $('#browse').hide();
    $('#log-out').show();
    $('body').addClass('darkbg');
    APP.main.append("<div id='browse-container'></div>");
    browseSelf.render();
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
    var petsQuery = new Parse.Query(Pet);
    petsQuery.limit(1000);
    petsQuery.select("uniqueName");
    petsQuery.descending("updatedAt");
    petsQuery.find({
      success: function(results) {



  for (var i = 0; i < results.length ; i++){
    var petUName = results[i].attributes.uniqueName;
    var ppQuery1 = new Parse.Query(ParsePic);
    ppQuery1.equalTo("petUniqueName",petUName);
    ppQuery1.containedIn("size",
                ["original", "undefined"]);

    var ppQuery2 = new Parse.Query(ParsePic);
    ppQuery2.equalTo("petUniqueName",petUName);
    ppQuery2.doesNotExist("size");

    var ppQuery =  new Parse.Query.or(ppQuery1, ppQuery2);



    ppQuery.ascending("petname");


    ppQuery.find({
      success: function(results) {
          if (results.length > 0) {
            var randomImg = Math.floor(Math.random() * (results.length));
            browseSelf.showPics(results[randomImg]);
        };
      }
    });
  }


},
  error: function(error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });


},


showPics: function(results) {
    var browseView = $('#browse-template').html();
    $('#browse-container').append(_.template(browseView,results.attributes));
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
}

});
