// Initialize parse and support functions







// // This function is for me while I'm testing
// function doesConnectionExist() {
//     var xhr = new XMLHttpRequest();
//     var file = "http://www.pett.io/images/close.png";
//     var randomNum = Math.round(Math.random() * 10000);
//
//     xhr.open('HEAD', file + "?rand=" + randomNum, false);
//
//     try {
//         xhr.send();
//
//         if (xhr.status >= 200 && xhr.status < 304) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (e) {
//         return false;
//     }
// }

function runningLocally() {
  if (document.location.href.indexOf("localhost") > -1) {
    console.log('Running locally');
    return true;
  }
}

var local = runningLocally();
console.log(local);


// if (!(doesConnectionExist()))  {
//     alert('It looks like there may be a problem with your internet connection.' );
// }


try {
  Parse.initialize("9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC", "DGHfzC6pvsu3P94CsFDReHIpwB3CUf7Pe0dP4WiP");
  console.log("Parse initialized");
}  catch (exception)
  {
    alert('It looks like pett.io is having trouble connecting to its database server. We\'re quite sorry. Please try again shortly.' )
  };



function getDims(image) {
  dimsPromise = Promise.resolve(function(image){
    var dimsPromise = Promise.resolve($("<img/>").attr("src", url).load());
    return dimsPromise.then(function(image) {
        dims = {w:this.width, h:this.height};
        console.log(dims);
        return dims;
    });
  });
};



function disable(el){
  $(el).prop("disabled",true);
}

function enable(el){
  $(el).prop("disabled",false);
}


// Misc global variables

    nullDateBirth = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";
    nullDateDeath = "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)";
    nullDateAdopted = "Thu Jan 01 1970 00:00:00 GMT-0500 (EST)";


/*** To test out splash images ***/

var changeImage = function (n) {
  if (!n) {
    n = prompt("Which image?");
  }
  $('body').css('background-image', "linear-gradient(rgba(0, 0, 0, 0.0980392), rgba(0, 0, 0, 0.0980392)), url(http://www.pett.io/images/splash/splash" + n + ".jpg)")
}
