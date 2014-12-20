var ImageUploadView = Parse.View.extend ({

el: "#tools",

  initialize: function(pet) {
    upload = this;
    this.pet = pet;

    console.log('Loading upload form for', this.pet);
    // APP.header.append("<div id='tools-container'></div>");
    this.render(pet);
  },

  events: {

    'click .close'    : 'closeUpload'

  },


  render: function(pet){
        $('#tools').show();
        $('#tools-container').show();
        $('#tools-container').html($('#image-upload-template').html());

// from: https://parse.com/questions/uploading-files-to-parse-using-javascript-and-the-rest-api

    var files;
    var file;


    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected files
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function(s) {
      thisButton = this;
      disable(thisButton);
      var fileResult = '';
      for (var i = 0; file = files[i]; i++) {
        var f = file;
        var serverUrl = 'https://api.parse.com/1/files/' + file.name;
        var fSize = file.size;
        var fName = file.name;
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

          processData: false,
          contentType: false,
          success: function(data) {
            console.log("File available at: " + data.url);
            var newPic = new ParsePic ({
              url: data.url,
              filesize: fSize,
              filename: fName,
              username: Parse.User.current().getUsername(),
              petname: pet,
              petUniqueName: pet,
              source: 'parse',
              size: 'original'
            });
            newPic.save();
            alert('Photo successfully uploaded.');
            $('#file-list').empty();
            enable(thisButton);

            // clear the file selector
            var fileSelect = $('#fileselect');
            fileSelect.replaceWith( fileSelect = fileSelect.clone( true ) );

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
    $('#tools-container').hide();
    return false;
  },

});
