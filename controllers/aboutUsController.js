const AboutUsModel = require("../models/aboutUsModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveAboutUs = async (req, res) => {
  try {
    let aboutUsModel = new AboutUsModel();
    
    aboutUsModel.name = req.body.name
    aboutUsModel.title = req.body.title
    aboutUsModel.description = req.body.description
   
    const insertedData = await aboutUsModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"about us created",insertedData})
    } else {
      throw new Error("about us not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchAboutUs = async (req, res) => {
    try {
      let allAboutUsData = await AboutUsModel.find({})
      
      if (allAboutUsData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all about us data",allAboutUsData})
      } else {
        throw new Error("about us not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateAboutUs = async (req, res) => {
  try {
   
    const updatedData = await AboutUsModel.findOneAndUpdate(
      { _id: { $eq: req.body.about_us_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"about us updated", updatedData})
    } else {
      throw new Error("about us not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};