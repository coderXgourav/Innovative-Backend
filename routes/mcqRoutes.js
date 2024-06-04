const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  deleteMcqTemplates,
  updateMcqTemplates,
  getMcqTemplates,
  saveMcqTemplates,
} = require("../controllers/mcqController");
const path = require("path");
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

router.post(
  "/",getToken, verifyToken,
  upload.fields([
    {
      name: "banner",
    },
    {
      name: "options",
    },
    {
      name: "answers",
    },
  ]),
  saveMcqTemplates
);
router.put("/",getToken, verifyToken, upload.fields([
  {
    name: "banner",
  },
  {
    name: "db_options",
  },
  {
    name: "db_answers",
  },
  {
    name: "options",
  },
  {
    name: "answers",
  },
]), updateMcqTemplates);
router.get("/", getToken, verifyToken,getMcqTemplates);
router.delete("/",getToken, verifyToken,deleteMcqTemplates)
module.exports = router;
