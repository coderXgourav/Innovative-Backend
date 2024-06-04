const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  saveTemplates,
  getTemplates,
  updateTemplates,
  deleteTemplates
 
} = require("../controllers/fileController");

const { getToken, verifyToken } = require("../controllers/userController");

const router = express.Router();

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Multer setup
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });


router.post("/",  getToken, verifyToken, upload.array('files', 10), saveTemplates);
router.get("/",getToken, verifyToken, getTemplates);
router.put("/", getToken, verifyToken,  upload.array('files', 10), updateTemplates);
router.delete("/",getToken, verifyToken, deleteTemplates);

module.exports = router;
