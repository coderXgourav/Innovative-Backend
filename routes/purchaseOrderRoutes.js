const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
    savePurchaseOrders,
    fetchPurchaseOrders,
    updatePurchaseOrders,
    deletePurchaseOrders
} = require("../controllers/purchaseOrderController");
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


router.post("/", getToken, verifyToken, upload.array('logo', 1),  savePurchaseOrders);
router.put("/", getToken, verifyToken,upload.array('logo', 1),   updatePurchaseOrders);
router.get("/",  getToken, verifyToken,  fetchPurchaseOrders);
router.delete("/",  getToken, verifyToken,  deletePurchaseOrders);
module.exports = router;
