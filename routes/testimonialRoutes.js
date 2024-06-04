const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { saveTestimonials, fetchTestimonials, updateTestimonials, deleteTestimonials } = require("../controllers/testimonialController");

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


router.post("/",getToken, verifyToken,
//  upload.fields([
//   {
//     name: "testimonial",
//   }
// ]), 
saveTestimonials);

router.get("/",getToken, verifyToken, fetchTestimonials);
router.put("/", 
// upload.fields([
//   {
//     name: "testimonial",
//   }
// ]), 
getToken, verifyToken,
updateTestimonials);

router.delete("/",getToken, verifyToken, deleteTestimonials);

module.exports = router;
