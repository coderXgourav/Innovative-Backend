const express = require("express");
const { getToken, verifyToken } = require("../controllers/userController");
const { saveEmailUs,updateEmailUs, fetchEmailUs } = require("../controllers/emailUsController.js");

const router = express.Router();

router.post("/", getToken, verifyToken,saveEmailUs );
router.put("/", getToken, verifyToken, updateEmailUs);
router.get("/", getToken, verifyToken, fetchEmailUs);
// router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
