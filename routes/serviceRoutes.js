const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
   saveServices,
   fetchServices,
   updateServices,
   deleteServices
} = require("../controllers/serviceController");
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


router.post("/", getToken, verifyToken,upload.fields([
    {
        name: "service",
    }
]), saveServices);

router.get("/",getToken, verifyToken,fetchServices);
router.put("/", getToken, verifyToken,upload.fields([
    {
        name: "service",
    }
]), updateServices);

router.delete("/",getToken, verifyToken,deleteServices);

module.exports = router;