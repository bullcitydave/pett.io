var MapView = Parse.View.extend ({

  el: "body",

  initialize: function() {
    $(this.el).append($('#map-template'));

    console.log('Getting map...');

    map = this;

    $('#main-container').css("opacity", .3);


    var query = new Parse.Query(Pet);
    var tempGeo = new Parse.GeoPoint(45,-45);
    query.near("geoLocation",tempGeo );
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length+ ". Attempting to render...");
        map.render(results[0].attributes);
        console.log(results[0].attributes);
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

    events: {

      'click .close'    : 'closeMap'

    },

    closeMap: function(e) {
      map.el.fadeOut(750);
    },

    render: function(data){
      console.log('render');
    }
});
