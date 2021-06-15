// Inventory management system...
// E-commerce app...React Native....

// React -> Dashboard.
// IN dashboard
// Categories add, remove, edit, delete -> Done
// Products add, remove, edit, delete -> Done
// name, description, image: url.., price, categoryId, createdAt, published
// Authentication... -> In Progress
// Order reviews...-> Pending

const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend..
    credentials: true,
  })
); // Access - * -> insecure....

const cookieParser = require("cookie-parser");
app.use(cookieParser());
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
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

// HTTP Requests
// GET -> To get some data -> when we want to read data from the server
// POST -> To create some data -> when we want to send some data to the server...
// PUT -> when we want to update some data on the server -> database..
// DELETE -> when we want to delete some data on the backend server -> database...
// PATCH -> movies -> title ...

app.get("/", (req, res) => {
  res.send("Welcome to Node.js Home page.");
});

// Import middlewares
const verifyToken = require("./routes/middlewares/verifyToken");

// URL params..
// REACT ROUTER -> <Route path="/blog/1" /> // params..
// const {id} = useParams()

// app.use("/api/posts", postRoutes);
// Protected routes...
app.use("/api/categories", verifyToken, categoryRoutes);
app.use("/api/products", verifyToken, productRoutes);

app.use("/api/auth", authRoutes);

// http://localhost:3000

app.listen(process.env.PORT || PORT, () => {
  console.log("Node.js Server is running on port 5000");
});
