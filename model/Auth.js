const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("Auth", authSchema);
