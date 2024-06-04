const express = require("express");
const {
  saveOurVision,
  fetchOurVision,
  updateOurVision
  
} = require("../controllers/ourVisionController");
const { getToken, verifyToken } = require("../controllers/userController");

const router = express.Router();

router.post("/", getToken, verifyToken, saveOurVision);
router.put("/", getToken, verifyToken, updateOurVision);
router.get("/", getToken, verifyToken, fetchOurVision);
// router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
