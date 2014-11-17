    var Pet = Parse.Object.extend("Pet", {

        defaults:{
          "dateDeath": new Date("12/31/2029"),
          "dateBirth": new Date("01/01/1970"),
          "dateAdopted": new Date("01/01/1970")
        },


        isLiving: function () {
          return (this.get("dateDeath") == "Mon Dec 31 2029 00:00:00 GMT-0500 (EST)" || this.get("dateDeath") == undefined);
        },

        age: function() {
          var age = Math.floor(((new Date()-this.get("dateBirth")))/(1000*60*60*24*365.25));
          var ageString = age.toString();

          switch (ageString) {
            case '44':
              ageString = '';
              break;

            case '0':
              age = Math.floor((((new Date()-this.get("dateBirth")))/(1000*60*60*24*365.25))*12);
              ageString = age + ' months old';
              break;

            case '1':
              ageString = '1 year old';
              break;

            default:
              ageString = ageString + ' years old';
          }
          return ageString;
        }

    });




    var ParsePic = Parse.Object.extend("ParsePic", {

    });


    var FlickrPic = Parse.Object.extend("FlickrPic", {

      defaults:{

      }

    });

    var PersonPetTags = Parse.Object.extend("PersonPetTags", {

      defaults:{

      }

    });


    var ParsePicCollection = Parse.Collection.extend({
      model: ParsePic
    });



    var FlickrPicList = Parse.Collection.extend({
        model: FlickrPic,
        url: 'https://api.parse.com/1/classes/',

        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        comparator: function(flickrpic) {
          return flickrpic.get('order');
        }

      });


    var ParsePicList = Parse.Collection.extend({
        model: ParsePic,

        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        comparator: function(parsepic) {
          return parsepic.get('order');
        }

      });

      var Vine = Parse.Object.extend("Vine", {

        defaults:{ "source" : "vine"

        }

      });


      var VineList = Parse.Collection.extend({
          model: Vine,

          nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
          },

          comparator: function(vine) {
            return vine.get('order');
          }

        });

    var Pets = Parse.Collection.extend({

      model:Pet

    });

    thesePets = new Pets();
