const mongoose = require("mongoose");
const yup = require("yup");

const ObjectId = mongoose.Types.ObjectId;

// name, description, image: url.., price, categoryId, createdAt, published
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
    max: 1024,
  },
  // SQL -> primary foreign keys....
  // Categories -> collection _id....
  // MONGODB -> ID object type??
  categoryId: {
    type: ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  published: {
    type: Boolean,
    default: false,
  },
});

// Create a validation schema
const validationSchema = yup.object({
  name: yup.string().min(5).max(255).required(),
  description: yup.string(),
  image: yup.string().max(1024).required(),
  categoryId: yup.string().required(),
  price: yup.number().required(),
  createdAt: yup.date(),
  published: yup.boolean(),
});

module.exports.Product = mongoose.model("Product", productSchema);
module.exports.validationSchema = validationSchema;
