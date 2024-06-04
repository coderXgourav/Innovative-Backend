const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
    saveTraingModules,
    fetchTraingModules,
    updateTraingModules,
    deleteTrainingModules
} = require("../controllers/trainingModuleController");

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
        name: "trainingModule",
    }
]), saveTraingModules);

router.get("/", getToken, verifyToken,fetchTraingModules);
router.put("/", getToken, verifyToken,upload.fields([
    {
        name: "trainingModule",
    }
]), updateTraingModules);

router.delete("/", getToken, verifyToken,deleteTrainingModules);

module.exports = router;
