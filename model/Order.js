const mongoose = require("mongoose");
const yup = require("yup");

const orderSchema = mongoose.Schema({
  /*
  Items Array
  {
      "_id": "60d9c83af9689166df7c95c1",
      "basePrice": 579,
      "image": "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "name": "Justina Frederick",
      "price": 579,
      "quantity": 1,
    }
  */
  items: {
    type: Array,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  user: {
    type: Object, // {email: '....', 'name': '....', 'id': '....'}
    required: true,
    max: 1024,
  },
  paymentType: {
    type: Number, // 1 -> Card pre-payment 2 -> COD..cash on delivery
    // default: 2
    required: true,
  },
  checkoutInfo: {
    type: Object, // {address: 'xxxx', 'contact': 'xxx'}
    required: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now(),
  },
});

// Create a validation schema
const validationSchema = yup.object({
  items: yup.array().required(),
  totalPrice: yup.number().required(),
  user: yup.object().required(),
  paymentType: yup.number().required(),
  checkoutInfo: yup.object().required(),
  orderedAt: yup.date(),
});

module.exports.Order = mongoose.model("Order", orderSchema);
module.exports.validationSchema = validationSchema;
