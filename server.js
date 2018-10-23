var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/3000";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
 
  axios.get("https://www.nytimes.com/section/us").then(function(response) {
   
    var $ = cheerio.load(response.data);

    $(".story-body").each(function(i, element) {
      
      var result = {};

      result.title = $(this).children("a").children("div").children("h2").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).children("a").children("div").children("p").text();
      result.image = $(this).children("a").children("div").children("img").attr("src");
      result.isSaved = false;

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
      
    });

    res.send(result);
  });
});
app.get("/articles", function(req, res) {
  db.Article.find({}, function(err, found) {
    if (err) console.log(err);
    else res.json(found);
    })
});

app.post("/saveArticle", function(req, res) {
  console.log("Saving article", req.body);
  db.Article.update({
    "link": req.body
  },
  {
    $set: {"isSaved": true}
  },
  function(err, found) {
    if (err) console.log(err);
    else res.json(found);
    })
});

app.get("/saved", function(req, res) {
  db.Article.find({
    "saved": true
  }, function(err, found) {
    if (err) console.log(err);
    else res.json(found);
    })
});

app.get("/articles/:id", function(req, res) {

});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
