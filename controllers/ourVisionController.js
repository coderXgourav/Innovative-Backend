const OurVisionModel = require("../models/ourVisionModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveOurVision = async (req, res) => {
  try {
    let ourVisionModel = new OurVisionModel();
    
    ourVisionModel.name = req.body.name
    ourVisionModel.title = req.body.title
    ourVisionModel.description = req.body.description
   
    const insertedData = await ourVisionModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"our vision created",insertedData})
    } else {
      throw new Error("our vision not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchOurVision = async (req, res) => {
    try {
      let allOvData = await OurVisionModel.find({})
      
      if (allOvData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all our vision data",allOvData})
      } else {
        throw new Error("our visions not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateOurVision = async (req, res) => {
  try {
   
    const updatedData = await OurVisionModel.findOneAndUpdate(
      { _id: { $eq: req.body.ov_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"our vision updated", updatedData})
    } else {
      throw new Error("our vision not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};
