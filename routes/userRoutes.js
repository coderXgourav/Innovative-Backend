const express = require("express");
const {
    signUp, getUsers, signIn, getToken, verifyToken,updateUsers,
    deleteUsers,
    verifyTokenWithoutNext

} = require("../controllers/userController");


const router = express.Router();


router.post("/signup", signUp);
router.post("/create-user",getToken, verifyToken, signUp);
router.post("/signin", signIn);
router.post("/verify-token", verifyTokenWithoutNext);
router.get("/", getToken, verifyToken,getUsers);
router.put("/",getToken, verifyToken, updateUsers);
router.delete("/",getToken, verifyToken, deleteUsers);

module.exports = router;
