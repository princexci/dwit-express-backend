const mongoose = require("mongoose");
const yup = require("yup");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
});

// Validation schema
const validationSchema = yup.object({
  name: yup.string().required().min(4).max(255),
});

// ...
module.exports.Category = mongoose.model("Category", categorySchema);
module.exports.validationSchema = validationSchema;
