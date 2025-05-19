const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = "upload/";

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
module.exports = upload;
