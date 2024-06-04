const express = require("express");
const { getToken, verifyToken } = require("../controllers/userController");
const { saveAboutUs, updateAboutUs, fetchAboutUs } = require("../controllers/aboutUsController");

const router = express.Router();

router.post("/", getToken, verifyToken, saveAboutUs);
router.put("/", getToken, verifyToken, updateAboutUs);
router.get("/", getToken, verifyToken, fetchAboutUs);
// router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
