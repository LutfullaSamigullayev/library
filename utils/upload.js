const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./upload/files",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploadFile = multer({ storage });

module.exports = uploadFile;