const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Makes the app able to recognize json data from request body..
app.use(express.json());

// Connect to mongodb database
mongoose.connect(
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
);

// Post routes
const postRoutes = require("./routes/posts");

// HTTP Requests
// GET -> To get some data -> when we want to read data from the server
// POST -> To create some data -> when we want to send some data to the server...
// PUT -> when we want to update some data on the server -> database..
// DELETE -> when we want to delete some data on the backend server -> database...
// PATCH -> movies -> title ...

app.get("/", (req, res) => {
  res.send("Welcome to Node.js Home page.");
});

// URL params..
// REACT ROUTER -> <Route path="/blog/1" /> // params..
// const {id} = useParams()

app.use("/api/posts", postRoutes);

// http://localhost:3000

app.listen(5000, () => {
  console.log("Node.js Server is running on port 5000");
});
