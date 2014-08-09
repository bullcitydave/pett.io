var SplashView = Parse.View.extend({
  events: {
    "click": "logIn",
    "submit form.signup-form": "signUp"
  },

  el: "#main-container",

  splashHead: "#main-header",

  initialize: function() {
    console.log("Splash view initialized")
    _.bindAll(this, "logIn", "signUp");
    this.render();
  },

  logIn: function(e) {
    var self = this;
    var username = this.$("#login-username").val();
    var password = this.$("#login-password").val();


    Parse.User.logIn(username, password, {
        success: function(user) {
          new LinkView('zellouisa'); // need function to render first pet of user
          self.undelegateEvents();
          delete self;

        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
        });
        this.$(".login-form button").attr("disabled", "disabled");

        return false;
      },

  signUp: function(e) {
    var self = this;
    var username = this.$("#signup-username").val();
    var password = this.$("#signup-password").val();

    Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
          success: function(user) {
            new LinkView();
            console.log(self);
            self.undelegateEvents();
            delete self;
          },

          error: function(user, error) {
            self.$(".signup-form .error").html(error.message).show();
            self.$(".signup-form button").removeAttr("disabled");
          }
        });

    this.$(".signup-form button").attr("disabled", "disabled");

    return false;
  },

  render: function() {
    console.log('Main el: ', this.$el);
    console.log('Head el: ', $(this.splashHead));
    this.$el.html(_.template($("#splash-template").html()));
    $(this.splashHead).html(_.template($("#splash-header-template").html()));


  }
});
