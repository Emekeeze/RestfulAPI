const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const port = 3000;
mongoose.set("strictQuery", false); // To prepare for the change (less strict queries)

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the MongoDB database
mongoose.connect("mongodb://localhost:27017/WeekendDB");
const articlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articlesSchema);
const article = new Article({
  title: "ABU Zaria",
  content: "ABU is located in zaria and its a fedreal institute",
});

article.save(function (err) {
  if (err) {
    console.error("Error saving article:", err);
  } else {
    console.log("Article saved successfully.");
  }
});

// Set the view engine to EJS
app.set("view engine", "ejs");

// Define a route handler for the root route ("/")
app.route("/article").get((req, res) => {
  Article.find()
    .then(function (foundArticles) {
      res.send(foundArticles);
    })
    .catch(function (err) {
      console.error("Error occurred while fetching articles:", err);
      res.status(500).send("An error occurred while fetching articles.");
    });
});

//Targeting specific routes
app.route("/article/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then(function(foundArticle) {
        res.send(foundArticle);
      })
      .catch(function(error) {
        res.send(error);
      });
  })
  .put((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true })
      .then(() => {
        res.send('Successfully updated');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('An error occurred while updating the article.');
      });
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: req.body })
      .then(() => {
        res.send('Successfully patched');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('An error occurred while patching the article.');
      });
  })
  .delete((req, res) => {
  Article.deleteOne({title:req.params.articleTitle}).then(function(){
    res.send('article deleted')
  }).catch(function(err){
    console.log(err)
  })
  })


// Start the Express server and listen on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
