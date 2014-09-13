var LoginView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn"
  },

  el: "#main-header",

  initialize: function() {
    console.log("LoginView initialized");
    $('#big-browse').hide();
    $('h2').hide();
    $('#signup').remove();
    _.bindAll(this, "logIn");
    self = this;
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();

    Parse.User.logIn(username, password, {
        success: function(user) {
          self.$el.html('');
          APP.getDefaultPet();
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
        });
        this.$(".login-form button").attr("disabled", "disabled");

        return false;
      },

  render: function() {
      $("#signup-username").attr('placeholder','');
      $("#signup-password").attr('placeholder','');

      $('#header-box-overlay h1').after(_.template($("#login-template").html()));
  }
});
