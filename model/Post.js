// Data modelling..
// What the data looks like?
// What kind of data is stored in Post
// title: String, content: String

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 10,
    max: 255,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// Export the model with provided schema
module.exports = mongoose.model("Post", postSchema);
