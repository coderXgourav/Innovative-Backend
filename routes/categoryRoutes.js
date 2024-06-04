const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
    saveCategories,
    fetchCategories,
    updateCategories,
    deleteCategories

} = require("../controllers/categoryController");
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
        name: "category",
    }
]), saveCategories);
router.put("/",getToken, verifyToken, upload.fields([
    {
        name: "category",
    }
]), updateCategories);
router.get("/", getToken, verifyToken,fetchCategories);
router.delete("/", getToken, verifyToken,deleteCategories);
module.exports = router;
