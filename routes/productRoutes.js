const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  saveProducts, 
  fetchProducts,
  updateProducts,
  deleteProducts
} = require("../controllers/productController");
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
    name: "product",
  }
]), saveProducts);

router.get("/",getToken, verifyToken, fetchProducts);
router.put("/", getToken, verifyToken,upload.fields([
  {
    name: "product",
  }
]), updateProducts);

router.delete("/", getToken, verifyToken,deleteProducts);

module.exports = router;
