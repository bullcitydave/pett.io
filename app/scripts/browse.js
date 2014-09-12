
var BrowseView = Parse.View.extend({

  el: "#main-container",



  initialize: function(tag) {
    if (Parse.User.current() != null) {
       user=Parse.User.current().get("username");
     }
    else {
       user=null;
    }

    browseSelf=this;
    console.log('Initializing browse view');
    $('body').addClass('darkbg');
    $('body').removeClass('splash');
    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').addClass('browse');
    $('#header-nav').show();
    $('#browse').hide();
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    if (user != null) {$('#main-header').html(_.template($('#header-template').html(),({"userName":user})));};
    $('#log-out').show();
    $('body').addClass('darkbg');
    $('#main-container').append("<div id='browse-container'></div>");
    browseSelf.render();


  },



  generateMedImgs: function() {

          Parse.Cloud.run('createMedImgs', {}, {
              success: function(result) {
                console.log(result); // result is 'Hello world!'
              },
              error: function(error) {
                console.log(error);
              }
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
    var petsQuery = new Parse.Query(Pet);
    petsQuery.select("uniqueName");
    petsQuery.ascending("uniqueName");
    petsQuery.find({
      success: function(results) {


  for (var i = 0; i < results.length ; i++)  { 
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



 }
}) ;
