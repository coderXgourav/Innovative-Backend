const OurMissionModel = require("../models/ourMissionModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveOurMission = async (req, res) => {
  try {
    let ourMissionModel = new OurMissionModel();
    
    ourMissionModel.name = req.body.name
    ourMissionModel.title = req.body.title
    ourMissionModel.description = req.body.description
   
    const insertedData = await ourMissionModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"our mission created",insertedData})
    } else {
      throw new Error("our mission not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchOurMission = async (req, res) => {
    try {
      let allOmData = await OurMissionModel.find({})
      
      if (allOmData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all our mission data",allOmData})
      } else {
        throw new Error("our missions not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateOurMission = async (req, res) => {
  try {
   
    const updatedData = await OurMissionModel.findOneAndUpdate(
      { _id: { $eq: req.body.om_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"our mission updated", updatedData})
    } else {
      throw new Error("our mission not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};
