const express = require("express");
const {
  saveOurMission,
  fetchOurMission,
  updateOurMission,
  
} = require("../controllers/ourMissionController");
const { getToken, verifyToken } = require("../controllers/userController");

const router = express.Router();

router.post("/", getToken, verifyToken, saveOurMission);
router.put("/", getToken, verifyToken, updateOurMission);
router.get("/", getToken, verifyToken, fetchOurMission);
// router.delete("/", getToken, verifyToken, deleteFaqs);
module.exports = router;
