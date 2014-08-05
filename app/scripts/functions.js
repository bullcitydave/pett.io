// Supporting functions


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
