$(function() {

  Parse.initialize("9MAJwG541wijXBaba0UaiuGPrIwMQvLFm4aJhXBC", "DGHfzC6pvsu3P94CsFDReHIpwB3CUf7Pe0dP4WiP");



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
    }
});

    new AppView;

  // Parse.history.start();   throwing error - Parse.history is undefined

  $('.montageSquare').bind('load', function() {
  console.log('height ', $('.montageSquare').clientHeight);
  console.log('width ',  $('.montageSquare').clientWidth);
  });

});
