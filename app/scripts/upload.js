var ImageUploadView = Parse.View.extend ({

el: "#tools",

  initialize: function(pet) {
    this.pet = pet;

    console.log('Loading upload form for', this.pet);
    // $('#main-header').append("<div id='upload-container'></div>");
    this.render(pet);
  },

  events: {

    'click #close-upload'    : 'closeUpload'

  },


  render: function(pet){
        $('#upload-container').show();
        $('#upload-container').html($('#image-upload-template').html());

// from: https://parse.com/questions/uploading-files-to-parse-using-javascript-and-the-rest-api

    var files;
    var file;
    var fileResult = '';

    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected files
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function(s) {
    for (var i = 0; file = files[i]; i++) {

      var serverUrl = 'https://api.parse.com/1/files/' + file.name;
      fileResult += '<li>' + file.name + ' ' + file.size + ' bytes<progress></progress></li>';
      $('ul#file-list').html(fileResult);
      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", '9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC');
          request.setRequestHeader("X-Parse-REST-API-Key", 'qgbJ6fvbU3byB3RGgWVBsXlLSrqN96WMSrfgFK2n');
          request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: file,
        // xhr: function() {  // Custom XMLHttpRequest
        //     var myXhr = $.ajaxSettings.xhr();
        //     if(myXhr.upload){ // Check if upload property exists
        //         myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
        //     }
        //     return myXhr;
        // },

        processData: false,
        contentType: false,
        success: function(data) {
          console.log("File available at: " + data.url);
          var newPic = new ParsePic ({
            url: data.url,
            username: Parse.User.current().getUsername(),
            petname: pet,
            source: 'parse'
          });
          newPic.save();
          alert('Photo has been successfully uploaded. Refresh the page to view the image in the gallery.');
          $('#file-list').html('');
          $('#file-select').html('');

        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });
    }
    });
  },

  progressHandlingFunction: function(e){
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
},


  closeUpload: function(e) {
    $('#upload-container').hide();
//     $('.pic-showcase').masonry({
//
//
// });
    return false;
  },

});
