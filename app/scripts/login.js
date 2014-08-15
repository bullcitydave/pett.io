var LoginView = Parse.View.extend({
  events: {
    "submit form.login-form": "logIn"
  },

  el: "#main-container",

  initialize: function() {
    console.log("LoginView initialized");
    $('#browse').hide();
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
          APP.initialize();
          // app_router.navigate('//'+self.pet);
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
      console.log(this.$el);
      console.log($("#login-template").html());
      this.$el.append(_.template($("#login-template").html()));
  }
});
