const express = require("express");
const {
    saveCus,
    fetchCus,
    updateCus,
    deleteCus
} = require("../controllers/cusController");

const { getToken, verifyToken } = require("../controllers/userController");

const router = express.Router();




router.post("/",  getToken, verifyToken,  saveCus);
router.put("/",getToken, verifyToken,    updateCus);
router.get("/",  getToken, verifyToken,  fetchCus);
router.delete("/", getToken, verifyToken,   deleteCus);
module.exports = router;
