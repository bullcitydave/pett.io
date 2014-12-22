
var Image = require("parse-image");


Parse.Cloud.afterSave("ParsePic", function(request, response) {
  var pic = request.object;
  var status = pic.get("status");
  var user = request.user;

  console.log(pic);
  console.log(status);
  console.log(user);

  if (status === 9) {
    pic.destroy({
      success: function(pic) {
        // The object was deleted from the Parse Cloud.
      },
      error: function(pic, error) {
        // The delete failed.
        // error is a Parse.Error with an error code and message.
        response.error();
      }
    });
  }


})


Parse.Cloud.beforeSave("ParsePic", function(request, response) {

  var user = request.user;


  if  (user != null) {


    var pic = request.object;


    Parse.Cloud.httpRequest({
      url: pic.get("url")

    }).then(function(response) {
      var image = new Image();
      return image.setData(response.buffer);

    }).then(function(image) {
      var MAX_WIDTH = 300;
      var MAX_HEIGHT = 400;
      var tempW = image.width();
      var tempH = image.height();
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

      return image.scale({
        width: tempW,
        height: tempH
      });

    }).then(function(image) {
      console.log('width is ' + image.width());
      // Make sure it's a JPEG to save disk space and bandwidth.
      image.setFormat("JPEG");
      return image;

    }).then(function(image) {
      // Get the image data in a Buffer.
      var buffer =  image.data();
      return buffer;

    }).then(function(buffer) {
      // Save the image into a new file.
      var base64 = buffer.toString("base64");
      var file = new Parse.File("medium.jpg", { base64: base64});
      return file.save();

    }).then(function(file) {
      // Attach the image file to the original object.

      console.log(file.url());
      pic.set("medium", file);

    }).then(function(result) {
      response.success();
    }, function(error) {
      response.error();
    });
  }
  else {
    response.success();
  }
});



//
// var Image = require("parse-image");
//
// Parse.Cloud.beforeSave("ParsePic", function(request, response) {
//
// var user = request.user;
//
//
// if  (user.id === "Y9dDmIqvvk")  {
//
//
//   var pic = request.object;
//
//
//   Parse.Cloud.httpRequest({
//     url: pic.get("url")
//
//   }).then(function(response) {
//     var image = new Image();
//     return image.setData(response.buffer);
//
//   }).then(function(image) {
//
//     var MAX_WIDTH = 800;
//     var MAX_HEIGHT = 600;
//     var tempW = image.width();
//     var tempH = image.height();
//     if (tempW > tempH) {
//         if (tempW > MAX_WIDTH) {
//            tempH *= MAX_WIDTH / tempW;
//            tempW = MAX_WIDTH;
//         }
//     } else {
//         if (tempH > MAX_HEIGHT) {
//            tempW *= MAX_HEIGHT / tempH;
//            tempH = MAX_HEIGHT;
//         }
//     }
//
//    return image.scale({
//              width: tempW,
//              height: tempH
//            });
//
//   }).then(function(image) {
//     // Crop the image to the smaller of width or height.
//     var image_m = new Image();
//     image_m = image;
//     var images = [image,image_m]
//     var size = Math.min(image.width(), image.height());
//
//     images[0].crop({
//       left: (image.width() - size) / 2,
//       top: (image.height() - size) / 2,
//       width: size,
//       height: size
//     });
//     return images;
//
//   }).then(function(images) {
//     // Resize the image to 64x64.
//
//     images[0].scale({
//       width: 64,
//       height: 64
//     });
//     return images;
//
//   }).then(function(images) {
//     console.log('width is ' + images[0].width());
//       console.log('width of 1 is ' + images[1].width());
//     // Make sure it's a JPEG to save disk space and bandwidth.
//     images[0].setFormat("JPEG");
//     images[1].setFormat("JPEG");
//     return images;
//
//   }).then(function(images) {
//     // Get the image data in a Buffer.
//     var buffers =  [images[0].data(), images[1].data()];
//     return buffers;
//
//   }).then(function(buffers) {
//     // Save the image into a new file.
//     var base64_t = buffers[0].toString("base64");
//     var base64_m = buffers[1].toString("base64");
//     var files = [(new Parse.File("thumbnail.jpg", { base64: base64_t })), (new Parse.File("medium.jpg", { base64: base64_m }))];
//     files[0].save();
//     files[1].save();
//     return files;
//   }).then(function(files) {
//     // Attach the image file to the original object.
//     // console.log('Hello?');
//     // console.log(files[0].url());
//     // console.log(files[1].url());
//     pic.set("thumbnail", files[0]);
//     pic.set("medium", files[1]);
//
//   }).then(function(result) {
//     response.success();
//   }, function(error) {
//     response.error();
//   });
// }
// else {
//   response.success();
// }
// });



////////
// ONE-TIME JOB TO UPDATE EXISTING ORIGINAL IMAGES AND ATTACH A MEDIUM-SIZED IMAGE
////////

Parse.Cloud.job("mediumImages", function(request, status) {

  Parse.Cloud.useMasterKey();
  var Image = require("parse-image");

  var picsQuery = new Parse.Query("ParsePic");
  picsQuery.doesNotExist("thumbnail");

  picsQuery.each(function(pic) {
    // var size = {width:1024, height:768, label:'large'};
    // console.log(size);
    // scalePic(pic,size);
    //
    // var size = {width:300, height:400, label:'medium'};
    // console.log(size);
    // scalePic(pic,size);

    var size = {width:75, height:75, label:'thumbnail'};
    console.log(size);
    scalePic(pic,size);



    function scalePic(pic,size) {
      Parse.Cloud.httpRequest({
        url: pic.get("url")
      }).then(function(response) {
        var image = new Image();
        return image.setData(response.buffer);

      }).then(function(image) {
        var MAX_WIDTH = size.width;
        var MAX_HEIGHT = size.height;
        var tempW = image.width();
        var tempH = image.height();
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

        return image.scale({
          width: tempW,
          height: tempH
        });

      }).then(function(image) {
        // Make sure it's a JPEG to save disk space and bandwidth.
        image.setFormat("JPEG");
        return image;

      }).then(function(image) {
        // Get the image data in a Buffer.
        var buffer =  image.data();
        return buffer;

      }).then(function(buffer) {
        // Save the image into a new file.
        var base64 = buffer.toString("base64");
        var file = new Parse.File(size.label + ".jpg", { base64: base64});
        return file.save();

      }).then(function(file) {
        console.log(file.url());
        pic.set(size.label, file);
        pic.save();
      })
    }
  });

});


Parse.Cloud.job("largeImages", function(request, status) {

  Parse.Cloud.useMasterKey();
  var Image = require("parse-image");

  var picsQuery = new Parse.Query("ParsePic");
  picsQuery.doesNotExist("large");

  picsQuery.each(function(pic) {

    Parse.Cloud.httpRequest({
      url: pic.get("url")
    }).then(function(response) {
      var image = new Image();
      return image.setData(response.buffer);

    }).then(function(image) {
      var MAX_WIDTH = 1024;
      var MAX_HEIGHT = 1024;
      var tempW = image.width();
      var tempH = image.height();
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

      return image.scale({
        width: tempW,
        height: tempH
      });

    }).then(function(image) {
      // Make sure it's a JPEG to save disk space and bandwidth.
      image.setFormat("JPEG");
      return image;

    }).then(function(image) {
      // Get the image data in a Buffer.
      var buffer =  image.data();
      return buffer;

    }).then(function(buffer) {
      // Save the image into a new file.
      var base64 = buffer.toString("base64");
      var file = new Parse.File("large.jpg", { base64: base64});
      return file.save();

    }).then(function(file) {
      console.log(file.url());
      pic.set("large", file);
      pic.save();
    })
  });


});
