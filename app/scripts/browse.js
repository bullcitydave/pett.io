var BrowseView = Parse.View.extend({

  el: "#main-container",

  initialize: function(tag) {
    user=Parse.User.current().getUsername();

    $('#main-header').addClass('standard');
    $('#main-container').removeClass('splash');
    $('#main-container').addClass('standard');
    $('#main-container').html('');
    $('.pic-showcase').html('');
    $('#tools').html('');
    $('#main-header').html(_.template($('#header-template').html(),({"userName":user})));
    $('#main-container').append(_.template($('#browse-template').html()));
    $('#log-out').show();
    $('body').addClass('whitebg');
    $('#main-container').append("<div id='browse-container'></div>");
  },


  events: {
    "click #about"    : "showProfile",
    "click #upload"   : "imageUploadForm",
    "click #account"  : "viewAccount"
  },

  showProfile: function(e) {
    new ProfileView(pet);
  },

  imageUploadForm: function(e) {
    new ImageUploadView(pet);
  },

  viewAccount: function(e) {
    app_router.navigate('//account/'+Parse.User.current().getUsername());
    return false;
  }


});
