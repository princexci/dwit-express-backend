const router = require("express").Router();

// Import model Post
const Post = require("../model/Post");

// Prefix -> /api/posts/$1
// Standard practice
// REST API
// posts GET -> all posts return JSON
// posts/1 GET -> post of that id
// posts POST -> creates the provided post from the body
// posts PUT -> update the provided post from the body
// posts/:id DELETE -> delete the post from db with provided id

// Get all posts
router.get("/", async (req, res) => {
  const allPosts = await Post.find();
  res.send(allPosts);
});

// Get a specific post
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    if (post) {
      res.send(post);
    } else {
      res.send("Not found", 404);
    }
  } catch (e) {
    // Bad request
    return res.status(400).send();
  }
});

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    const newPost = new Post({ title, description });

    const savedData = await newPost.save();

    res.send(savedData);
  } catch (e) {
    return res.send("Error", 400);
  }
});

// Update an existing post
router.put("/:id", async (req, res) => {
  const { title, description, views } = req.body;
  const id = req.params.id;
  try {
    const postToUpdate = { title, description, views };
    const updatedPost = await Post.updateOne(
      { _id: id },
      { $set: postToUpdate }
    );
    res.send(updatedPost);
  } catch (e) {
    console.log(e);
    return res.status(400).send();
  }
});

// Delete an existing post
router.delete("/:id", async (req, res) => {
  try {
    // 1st => Get the id
    // 2nd => Remove that document from mongodb
    const id = req.params.id;

    const deletedPost = await Post.deleteOne({ _id: id });
    res.send(deletedPost);
  } catch (e) {
    return res.send("Error", 400);
  }
});

module.exports = router;
