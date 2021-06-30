const path = require("path");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // TODO -> what is null???
  },
  filename: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

let upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/webp"
    ) {
      cb(null, true);
    } else {
      console.log("Only png, jpg, jpeg, gif and webp are supported");
      cb(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit...
  },
});

module.exports = upload;
