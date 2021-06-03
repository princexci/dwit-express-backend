const mongoose = require("mongoose");

const validateMongoId = async (req, res, next) => {
  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    next();
  } else {
    res.status(400).send("Invalid Id. From middleware...");
  }
};

module.exports = validateMongoId;
