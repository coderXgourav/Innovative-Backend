const express = require("express");
const {
    saveInvoices,
    updateInvoices,
    fetchInvoices,
    deleteInvoices
 
} = require("../controllers/invoiceController");


const router = express.Router();
const { getToken, verifyToken } = require("../controllers/userController");



router.post("/",  getToken, verifyToken,  saveInvoices);
router.put("/", getToken, verifyToken,  updateInvoices);
router.get("/",  getToken, verifyToken,  fetchInvoices);
router.delete("/", getToken, verifyToken,   deleteInvoices);
module.exports = router;
