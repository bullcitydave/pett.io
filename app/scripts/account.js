var AccountView = Parse.View.extend({

  el: "#main-container",

  events: {
    "click #add-pet"                : "createPet",
    "submit form#add-pet-form"      : "submitPet",
    "submit form#edit-pet-form"     : "updatePet",
    "click #edit-profile"  : "editPet",
    "click #upload-image"  : "imageUploadForm",
    "click #view-page"     : "viewPet",
    "click #set-default"   : "setDefault",
    "click #add-flickr"    : "setFlickr",
    "mouseover .your-pet-option" : "highlightPet",
    "mouseout .your-pet-option" : "unhighlightPet"
  },


  initialize: function() {
    this.user = Parse.User.current().getUsername();

    document.title = 'pett.io - manage account';

    $('body').css('background','none');
    $('body').addClass('darkbg');
    $('body').removeClass('splash');
    console.log("Account view initialized");
    $(this.el).removeClass('splash');
    $(this.el).removeClass('browse');
    $(this.el).addClass('standard');
    APP.header.html(_.template($('#header-template').html(),({"userName":this.user})));
    APP.header.addClass('standard');
    $('body').addClass('darkbg');
    x=this;
    _.bindAll(this, "createPet");
    this.render();
  },


  createPet: function(e) {

    $('#update-pet').show();
    $('#update-pet').html(_.template($("#add-pet-template").html()));

    $( '#pet-dob' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-doa' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-dod' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });

    $( '#pet-weight').spinner({
      spin: function( event, ui ) {
        if ( ui.value > 150 ) {
          $( this ).spinner( "value", 0 );
          return false;
        } else if ( ui.value < 0 ) {
          $( this ).spinner( "value", 150 );
          return false;
        }
      }
    });

  },


  editPet: function(e) {
    pet = $(e.toElement).prevAll('.pet-list-name:first').html().toLowerCase();
    var query = new Parse.Query(Pet);
    query.equalTo("uniqueName", pet);
    query.first();
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + pet + ". Attempting to render...");
        var thisPet = results[0].attributes;
        x.petId = results[0].id;
        _.defaults(thisPet, {type: "unknown",dateBirth: "",dateDeath: "",dateAdopted: "",bio: "",favoriteTreats: "",colors: "",gender: "unknown",breeds: "",weight: "",bodyType: ""});

        if (nullDateBirth.toString() != thisPet.dateBirth.toString()) {thisPet.dateBirth   = APP.getDate(thisPet.dateBirth)}
          else { thisPet.dateBirth = null };

        if (nullDateDeath.toString() != thisPet.dateDeath.toString()) {thisPet.dateDeath   = APP.getDate(thisPet.dateDeath)}
          else { thisPet.dateDeath = null };

        if (nullDateAdopted.toString() != thisPet.dateAdopted.toString()) {thisPet.dateAdopted = APP.getDate(thisPet.dateAdopted)}
          else { thisPet.dateAdopted = null };

        console.log(thisPet.attributes);
        var editView = $("#edit-pet-template").html();
        $('#update-pet').show();
        $('#update-pet').html(_.template(editView,thisPet));

        x.getUiControls();
        x.editDropdownCleanup("pet-gender");
        x.editDropdownCleanup("pet-type");
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

  // http://stackoverflow.com/questions/1875607/filter-duplicate-options-from-select-dropdown
  editDropdownCleanup: function(dropdown) {
    var usedNames = {};
    $("select[id='" + dropdown + "'] > option").each(function () {
        if(usedNames[this.text]) {
            $(this).remove();
        } else {
            usedNames[this.text] = this.value;
        }
    });
  },


  getUiControls: function() {
    $( '#pet-dob' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-doa' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });
    $( '#pet-dod' ).datepicker({ minDate: "-40Y", maxDate: "+1M +10D", changeMonth: true, changeYear: true });

    $( '#pet-weight').spinner({
      spin: function( event, ui ) {
        if ( ui.value > 150 ) {
          $( this ).spinner( "value", 0 );
          return false;
        } else if ( ui.value < 0 ) {
          $( this ).spinner( "value", 150 );
          return false;
        }
      }
    });
  },

  submitPet: function(e) {
     e.preventDefault();
     thisButton = this;
     disable(thisButton);
     var newPet = new Pet ({
      name: $('input#pet-name').val(),
      uniqueName: $('input#pet-name').val().toLowerCase(),
      type: $('select#pet-type').val(),
      bio: $('textarea#pet-bio').val(),
      person: {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
      },
      dateBirth: new Date($('input#pet-dob').val() || "01/01/1970"),
      dateDeath: new Date($('input#pet-dod').val() || "12/31/2029"),
      dateAdopted: new Date($('input#pet-doa').val() || "01/01/1970"),
      favoriteTreats: $('textarea#pet-treats').val().split(','),
      breeds: $('textarea#pet-breeds').val().split(','),
      colors: $('textarea#pet-colors').val().split(','),
      bodyType: $('textarea#pet-body-type').val().split(','),
      gender: $('select#pet-gender').val(),
      weight: parseInt($('input#pet-weight').val())
     });
     newPet.save();
     console.log('Pet added to database');
     alert('Information for pet saved');
     enable(thisButton);
     x.cleanup();
     x.render();

     return false;
    },

  updatePet: function(e) {
     e.preventDefault();
     var query = new Parse.Query(Pet);
     query.get(x.petId, {
        success: function(pet) {
          pet.set("bio",$('textarea#pet-bio').val());
          pet.set("type",$('select#pet-type').val());
          pet.set("gender",$('select#pet-gender').val());
          pet.set("favoriteTreats",$('textarea#pet-treats').val().split(','));
          pet.set("breeds",$('textarea#pet-breeds').val().split(','));
          pet.set("colors",$('textarea#pet-colors').val().split(','));
          pet.set("bodyType",$('textarea#pet-body-type').val().split(','));
          pet.set("weight",parseInt($('input#pet-weight').val()));
          pet.set("dateBirth",new Date($('input#pet-dob').val() || "01/01/1970"));
          pet.set("dateAdopted",new Date($('input#pet-doa').val() || "01/01/1970"));
          pet.set("dateDeath",new Date($('input#pet-dod').val() || "12/31/2029"));
          pet.save();
          alert('Update saved.')
        },
        error: function(object, error) {
          console.log("Error: " + error.code + " " + error.message);
        }
      });

     return false;
    },


  imageUploadForm: function(e) {
    console.log($(e.toElement).prev().prev().prev().html());
    pet = $(e.toElement).prev().prev().prev().html().toLowerCase();
    new ImageUploadView(pet);
  },


  viewPet: function(e) {
    pet = $(e.toElement).prev().html().toLowerCase();
    app_router.navigate('/#/pet/' + pet);
    return false;
  },


  setDefault: function(e) {
    pet = $(e.toElement).prevAll('.pet-list-name:first').html().toLowerCase();

    x.pet = pet;

    console.log('Pet: ', pet);


    var pQuery = new Parse.Query(Pet);
    pQuery.equalTo("uniqueName", pet);
    pQuery.find({
      success:function(results) {
        console.log(results[0].id);
        x.petId = results[0].id;

        user = Parse.User.current();
        console.log('User: ', user);


        var uQuery = new Parse.Query(Parse.User);
        console.log('User id: ', user.id);
        uQuery.get(user.id, {
          success: function(results) {

            results.set("defaultPet",
                {
                  __type: "Pointer",
                  className: "Pet",
                  objectId: x.petId
                });

            results.save();
            console.log('Results: ',results);
            $(e.toElement).siblings('#set-default').addClass('not-default');
            $(e.toElement).siblings('#set-default').removeClass('default');
            $(e.toElement).siblings('#set-default').html("Set as default");
            $(e.toElement).addClass('default');
            $(e.toElement).removeClass('not-default');
            $(e.toElement).html("Default Pet");
            },

          error: function(myUser) {
            console.log('Could not determine default pet of ', myUser);
          }
        });
    } });
  },

  cleanup: function() {
    $('#ui-datepicker-div').remove();
  },

  render: function() {

    $('.site-visitor').hide();
    $('#upload').hide();
    $('#account').addClass('active');
    $('#account').siblings().removeClass('active');


    this.$el.html(_.template($("#account-template").html(), ({"userName": Parse.User.current().getUsername()})));

    var ppQuery = new Parse.Query(Pet);

    ppQuery.equalTo("person", {
        __type: "Pointer",
        className: "_User",
        objectId: Parse.User.current().getUsername()
    });

    console.log('ppQuery: ',ppQuery);

    ppQuery.find({
      success: function(results) {
          console.log('Returning pets:', results);
          if (results.length > 0)  { x.listPets(results); }
      },

      error: function(error) {
          console.log('No pets found');
        }
      });

      x.getFlickr();
    },


  listPets: function(results) {

    var defaultPetId = '';
    var dQuery = new Parse.Query(Parse.User);
    dQuery.equalTo("username", Parse.User.current().getUsername());
    dQuery.find({
      success:function(uResults) {
        if (uResults[0].attributes.defaultPet) {
          defaultPetId = uResults[0].attributes.defaultPet.id;
        }
        for (var i = 0; i < results.length ; i++) {
           console.log(results[i].attributes.name);
           $('#my-pet-list').append(_.template($('#pet-list-template').html(),
           ({name:results[i].attributes.name})));
           if (results[i].id === defaultPetId) {
               console.log('Default is ',results[i].attributes.name);
               $('#' + results[i].attributes.name).next().next().next().next().addClass('default');
               $('#' + results[i].attributes.name).next().next().next().next().html("Default Pet");
           }
            $('<option>').val(results[i].attributes.name).text(results[i].attributes.name)
               .appendTo('#pet-names');
         }
      },
      error:function(error) {
        console.log('No default pet found');
      }
    });
  },


  highlightPet: function(event) {
    $(event.target).prevAll('.pet-list-name:first').addClass('pet-selected');
  },

  unhighlightPet: function(event) {
    $(event.target).prevAll('.pet-list-name:first').removeClass('pet-selected');
  },


    //  e.preventDefault();
    //  var pptQuery = new Parse.Query(PersonPetTags);
    //  user = Parse.User.current();
    //  console.log('user: ', user);
    //  pptQuery.equalTo("username",user);
    //  pptQuery.equalTo()
    //       success: function(results) {
    //         results.set("flickrUser", $("input#flickr-account").val());
    //         var tag = $("input#flickr-tag").val();
    //         var pet = $("select#pet-names").val();
    //         var flickrPetTag = {pet:tag};
    //         // flickrPetTag = {$("input#flickr-tag").val():$("selection#pet-names").val()};
    //         results.set("flickrTag", flickrPetTag);
    //         results.save();
    //         alert('Did I save ', flickrPetTag);
    //        },
    //       error:function(error) {
    //         console.log('Could not set Flickr account');
    //       }
    //   });
    setFlickr: function(e) {
      var newPetPersonTag = new PersonPetTags ({
       username: Parse.User.current().getUsername(),
       pet: $("select#pet-names").val().toLowerCase(),
       flickrUser: $('input#flickr-account').val(),
       flickrTag: $('input#flickr-tag').val()
     });

      newPetPersonTag.save().then(function() {
       alert('Flickr user ' + $("input#flickr-account").val() + ' and Flickr tag ' + $("input#flickr-tag").val() + ' added for ' + $("select#pet-names").val());
       console.log('Flickr user ' + $("input#flickr-account").val() + ' and Flickr tag ' + $("input#flickr-tag").val() + ' added to database for pet ' + $("select#pet-names").val());
       }, function(error) {
       console.log('Error adding Flickr tag');
     });
   },


  getFlickr: function(e) {
// this is only get first tag listed for now until UI is reconfigured;
    var flickrUser = '';
    var fQuery = new Parse.Query(PersonPetTags);
    fQuery.equalTo("username", Parse.User.current().getUsername());
    // fQuery.equalTo("pet", x.pet);
    fQuery.find({
      success:function(results) {
        if (results.length > 0) {
          APP.flickrUser = results[0].attributes.flickrUser;
          APP.flickrTag = results[0].attributes.flickrTag;
          $("input#flickr-account").val(results[0].attributes.flickrUser);
          $("input#flickr-tag").val(results[0].attributes.flickrTag);
        }
      },
      error:function(error) {
        console.log('No flickr user found');
      }
    });
  }



});
