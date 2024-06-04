const express = require("express");
const { getToken, verifyToken } = require("../controllers/userController");
const { saveCallUs,updateCallUs, fetchCallUs } = require("../controllers/callUsController");

const router = express.Router();

router.post("/", getToken, verifyToken,saveCallUs );
router.put("/", getToken, verifyToken, updateCallUs);
router.get("/", getToken, verifyToken, fetchCallUs);
// router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
