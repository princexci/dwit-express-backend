// Inventory management system...
// E-commerce app...React Native....

// React -> Dashboard.
// IN dashboard
// Products add, remove, edit, delete
// Categories add, remove, edit, delete
// Order reviews...
// Authentication...

const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");

// Load env configuration
dotenv.config();

// Makes the app able to recognize json data from request body..
app.use(express.json());

// Connect to mongodb database with environment connection
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("Connected to DB")
);

// Import route modules
const postRoutes = require("./routes/posts");
const categoryRoutes = require("./routes/categories");

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
app.use("/api/categories", categoryRoutes);

// http://localhost:3000

app.listen(process.env.PORT, () => {
  console.log("Node.js Server is running on port 5000");
});
