var sampledata = [
  { "browseImg":"http://files.parsetfss.com/4fe73d2c-e2d1-42d1-bb33-657c49af4605/tfss-9a119094-9aa2-4730-9159-fa6a4c63d90e-hermancanvas.jpg",
  "petName":"Herman",
  "personUsername":"bullcitydave"}
];



  // parseImg:"http://files.parsetfss.com/4fe73d2c-e2d1-42d1-bb33-657c49af4605/tfss-03a00789-7d41-4538-8a6a-b3a476eafbd2-2014-03-05%2009.51.12.jpg", petName:"Zellouisa", personUsername:"bullcitydave"},  {parseImg:"http://files.parsetfss.com/4fe73d2c-e2d1-42d1-bb33-657c49af4605/tfss-f1ee7353-45d3-4253-a7c3-1ceb57e613ff-ar020501_171633538_m.jpg", petName:"Aremid", personUsername:"bullcitydave"}];
  //

var BrowseView = Parse.View.extend({

  el: "#main-container",



  initialize: function(tag) {
    user=Parse.User.current() || null;

    browseSelf=this;
    console.log('Initializing browse view');

    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('#main-container').append("<div id='browse-container'></div>");
    browseSelf.render();
  },


  events: {
    "click #about"    : "showProfile",
    "click #upload"   : "imageUploadForm",
    "click #account"  : "viewAccount"
  },

  render: function() {

    // var ppQuery = new Parse.Query(ParsePic);
    // // ppQuery.equalTo("username", Parse.User.current().getUsername());
    // ppQuery.equalTo("petname", tag);
    //
    // console.log('ppQuery: ',ppQuery);
    //
    // ppQuery.find({
    //   success: function(results) {
          // browseSelf.showPics(results);
      // },

      browseSelf.showPics(sampledata);


      // error: function(error) {
      //     alert('Error!');
      //   }
      // });
    },

  showPics: function(results) {
     var browseView = $('#browse-template').html();
     for (var i = 0; i < results.length ; i++) {
        console.log(results[i]);
        console.log(browseView);

       $('#browse-container').append((_.template(browseView),results[i]));
      //  $('#browse-container').append(_.template(browseView),results[i]);

      //  $('#browse-container').append(_.template(browseView),JSON.stringify(results[i]));

     }
     return false;
   }




});
