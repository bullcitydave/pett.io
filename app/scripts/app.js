$(function() {





  var AppView = Parse.View.extend({

    el: $("#main-container"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        console.log(Parse.User.current());
        new LinkView();
      } else {
        console.log('login view needed...');
        new LogInView();
      }
    },


    displayMessage: function(txt) {
      $('.display-message').show.html(txt);

    }
});

    new AppView;


  // Parse.history.start();   throwing error - Parse.history is undefined

 /// image upload


 $(function() {
    var file;

    // Set an event listener on the Choose File field.
    $('#fileselect').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
    });

    // This function is called when the user clicks on Upload to Parse. It will create the REST API request to upload this image to Parse.
    $('#uploadbutton').click(function() {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

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
            username: Parse.User.current().getUsername(),
            petname: $('h1').html(),
            source: 'parse'
          });
          newPic.save();
            alert('Photo has been successfully uploaded');
        },
        error: function(data) {
          var obj = jQuery.parseJSON(data);
          alert(obj.error);
        }
      });
    });


  });

});
