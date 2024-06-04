const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
 savePartners,
 updatePartners,
 getPartners,
 deletePartners
} = require("../controllers/partnerController");

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


router.post("/",getToken, verifyToken, upload.fields([
  {
    name: "partner",
  }
]), savePartners);

router.get("/", getToken, verifyToken,getPartners);
router.put("/", getToken, verifyToken,upload.fields([
  {
    name: "partner",
  }
]), updatePartners);

router.delete("/",getToken, verifyToken, deletePartners);

module.exports = router;
