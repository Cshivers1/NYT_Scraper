var mongoose = require("mongoose");
// Needed alot of help with this section 
var Schema = mongoose.Schema;

// Used the Schema constructor

var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  isSaved: {
    type: Boolean
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;
