var AccountView = Parse.View.extend({

  el: "#main-container",

  events: {
    "click #add-pet"  : "createPet",
    "submit"          : "submitPet",
    "click #upload"   : "imageUploadForm"
  },

  initialize: function() {
    console.log("Account view initialized");
    $(this.el).removeClass('splash');
    $(this.el).addClass('standard');
    $('#main-header').addClass('standard');
    $('body').addClass('whitebg');
    x=this;
    _.bindAll(this, "createPet");
    this.render();
  },

  createPet: function(e) {
    $('#add-pet').hide();
    $('.user-profile').append(_.template($("#add-pet-template").html()));
  },

  submitPet: function(e) {
     e.preventDefault();
     var newPet = new Pet ({
      name: $('input#pet-name').val(),
      uniqueName: $('input#pet-name').val().toLowerCase(),
      bio: $('input#bio').val(),
      person: {__type: "Pointer",
      className: "_User",
      objectId: Parse.User.current().getUsername()
      }
     });
     newPet.save();
  },

  imageUploadForm: function(e) {
    console.log($(e.toElement).prev().html());
    pet = $(e.toElement).prev().html().toLowerCase();
    new ImageUploadView(pet);
  },

  render: function() {
    this.$el.html(_.template($("#account-template").html(), ({"userName": Parse.User.current().getUsername()})));

    var ppQuery = new Parse.Query(Pet);
    // ppQuery.equalTo("person", Parse.User.current().getUsername());

    ppQuery.equalTo("person", {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
    });

    console.log('ppQuery: ',ppQuery);

    ppQuery.find({
      success: function(results) {
          x.listPets(results);
      },

      error: function(error) {
          alert('Error!');
        }
      });
    },

  listPets: function(results) {
     for (var i = 0; i < results.length ; i++) {
        console.log(results[i].attributes.name);
  $('#my-pet-list').append(_.template($('#pet-list-template').html(),({"name":results[i].attributes.name})));

      //  $('#main-container').append(_.template($('#my-pet-list').html(),({"petName":tag})));
     }
  }
});
