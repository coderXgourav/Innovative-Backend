const CallUsModel = require("../models/callUsModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveCallUs = async (req, res) => {
  try {
    let callUsModel = new CallUsModel();
    
    callUsModel.name = req.body.name
    callUsModel.phone_no = req.body.phone_no
    callUsModel.description = req.body.description
   
    const insertedData = await callUsModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"call us created",insertedData})
    } else {
      throw new Error("call us not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchCallUs = async (req, res) => {
    try {
      let allCallUsData = await CallUsModel.find({})
      
      if (allCallUsData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all call us data",allCallUsData})
      } else {
        throw new Error("call us not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateCallUs = async (req, res) => {
  try {
   
    const updatedData = await CallUsModel.findOneAndUpdate(
      { _id: { $eq: req.body.call_us_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"call us updated", updatedData})
    } else {
      throw new Error("call us not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};