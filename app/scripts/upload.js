var ImageUploadView = Parse.View.extend ({

el: "#tools",

  initialize: function(pet) {
    upload = this;
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
          alert('Photo' + fName + ' has been successfully uploaded.');
          upload.resizeAndUpload(f);  // generate medium image
          $('#file-list').html('');
          $('#file-select').html('');

          // $('.input').attr('value') = '';

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

// from http://www.codeforest.net/html5-image-upload-resize-and-crop
  resizeAndUpload: function(file) {
    // var reader = new FileReader();
    // reader.onloadend = function() {

      var tempImg = new Image();
      // tempImg.src = reader.result;
      tempImg.src = URL.createObjectURL(file); //THIS
      // tempImg = file;
      tempImg.onload = function() {

          var MAX_WIDTH = 800;
          var MAX_HEIGHT = 600;
          var tempW = tempImg.width;
          var tempH = tempImg.height;
          if (tempW > tempH) {
              if (tempW > MAX_WIDTH) {
                 tempH *= MAX_WIDTH / tempW;
                 tempW = MAX_WIDTH;
              }
          } else {
              if (tempH > MAX_HEIGHT) {
                 tempW *= MAX_HEIGHT / tempH;
                 tempH = MAX_HEIGHT;
              }
          }


          var canvas = document.getElementById('uploadCanvas');
          canvas.width = tempW;
          canvas.height = tempH;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0, tempW, tempH);

          var base64DataUri = canvas.toDataURL();
          var base64Data = base64DataUri.substring(base64DataUri.indexOf(',')+1);

          var jsonData = { "base64":base64Data,"_ContentType":"image/png" };

          var sendData = JSON.stringify(jsonData);
          var fSize = sendData.length;
          var fName = file.name;
          // var smallFilename = ((file.name).substr(0,((file.name).lastIndexOf('.'))).concat('_s.jpg'));

          var serverUrl = 'https://api.parse.com/1/files/' + file.name;

          $.ajax({
            type: "POST",
            beforeSend: function(request) {
              request.setRequestHeader("X-Parse-Application-Id", '9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC');
              request.setRequestHeader("X-Parse-REST-API-Key", 'qgbJ6fvbU3byB3RGgWVBsXlLSrqN96WMSrfgFK2n');
              request.setRequestHeader("Content-Type", "text/plain");
            },
            url: serverUrl,
            data: sendData,


            processData: false,
            contentType: false,
            success: function(data) {
              console.log("File available at: " + data.url);

              var newPic = new ParsePic ({
                url: data.url,
                username: Parse.User.current().getUsername(),
                petname: pet,
                petUniqueName: pet,
                size: data.size,
                filesize: fSize,
                filename: fName,
                source: 'parse',
                height: tempH,
                width: tempW,
                size: 'medium'
              });
              newPic.save();
              console.log('Medium photo has been successfully uploaded.');


            },
            error: function(data) {
              console.log('Error saving small photo')
            }
          });

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
