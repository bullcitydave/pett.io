
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {

  var currentUser = Parse.User.current().id;
    console.log('Current user is ' + currentUser);
  response.success("Hello " + currentUser + "!");

});



var Image = require("parse-image");

Parse.Cloud.beforeSave("ParsePic", function(request, response) {

var user = request.user;


if  (user.id === "Y9dDmIqvvk")  {


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
    console.log('Hello?');
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
