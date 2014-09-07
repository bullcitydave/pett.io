
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});



var Image = require("parse-image");

Parse.Cloud.beforeSave("ParsePic", function(request, response) {
  var pic = request.object;


  Parse.Cloud.httpRequest({
    url: pic.get("url")

  }).then(function(response) {
    var image = new Image();
    return image.setData(response.buffer);

  }).then(function(image) {

    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 600;
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
    // Crop the image to the smaller of width or height.
    var image_m = new Image();
    image_m = image;
    var images = [image,image_m]
    var size = Math.min(image.width(), image.height());

    images[0].crop({
      left: (image.width() - size) / 2,
      top: (image.height() - size) / 2,
      width: size,
      height: size
    });
    console.log('Images are ' + images);
    return images;

  }).then(function(images) {
    // Resize the image to 64x64.

    return [images[0].scale({
      width: 64,
      height: 64
    }),
    images[1]];

  }).then(function(images) {
    console.log(images[0].width);
      console.log(images[1].width);
    // Make sure it's a JPEG to save disk space and bandwidth.
    return [images[0].setFormat("JPEG"), images[1].setFormat("JPEG")];

  }).then(function(images) {
    // Get the image data in a Buffer.
    return [images[0].data(), images[1].data()];

  }).then(function(buffers) {
    // Save the image into a new file.
    var base64_t = buffers[0].toString("base64");
    var base64_m = buffers[1].toString("base64");
    var files = [(new Parse.File("thumbnail.jpg", { base64: base64 })), (new Parse.File("medium.jpg", { base64: base64 }))];
    return files;

  }).then(function(files) {
    // Attach the image file to the original object.
    pic.set("thumbnail", files[0]);
    pic.set("medium", files[1]);

  }).then(function(result) {
    response.success("Completed");
  }, function(error) {
    response.error(error);
  });


});
