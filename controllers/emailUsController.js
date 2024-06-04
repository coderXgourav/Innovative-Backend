const EmailUsModel = require("../models/emailUsModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveEmailUs = async (req, res) => {
  try {
    let emailUsModel = new EmailUsModel();
    
    emailUsModel.name = req.body.name
    emailUsModel.email = req.body.email
    emailUsModel.description = req.body.description
   
    const insertedData = await emailUsModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"email us created",insertedData})
    } else {
      throw new Error("email us not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchEmailUs = async (req, res) => {
    try {
      let allEmailUsData = await EmailUsModel.find({})
      
      if (allEmailUsData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all email us data",allEmailUsData})
      } else {
        throw new Error("email us not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateEmailUs = async (req, res) => {
  try {
   
    const updatedData = await EmailUsModel.findOneAndUpdate(
      { _id: { $eq: req.body.email_us_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"email us updated", updatedData})
    } else {
      throw new Error("email us not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};