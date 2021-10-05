const mongoose = require("mongoose");
const yup = require("yup");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024, // Because we're hashing the pw..
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().max(255).min(6).required(),
  mobile: yup.string().max(10).required(),
  password: yup.string().required().max(1024),
  date: yup.date(),
});

module.exports.User = mongoose.model("User", userSchema);
module.exports.validationSchema = validationSchema;
