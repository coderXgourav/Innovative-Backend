const express = require("express");
const {
  saveFaqs,
  fetchFaqs,
  updateFaqs,
  deleteFaqs,
} = require("../controllers/faqController");
const { getToken, verifyToken } = require("../controllers/userController");

const router = express.Router();

router.post("/", getToken, verifyToken, saveFaqs);
router.put("/", getToken, verifyToken, updateFaqs);
router.get("/", getToken, verifyToken, fetchFaqs);
router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
