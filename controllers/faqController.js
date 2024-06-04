const FaqModel = require("../models/faqModel");

const dotenv = require("dotenv");

var CryptoJS = require("crypto-js");



exports.saveFaqs = async (req, res) => {
  try {
    let faqModel = new FaqModel();
    faqModel.name = req.body.name
    faqModel.question = req.body.question
    faqModel.answer = req.body.answer
    

    const insertedData = await faqModel.save()
    if (insertedData) {
      return res.send({success: "yes",message:"faq created",insertedData})
    } else {
      throw new Error("faq not created")
    }


  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.fetchFaqs = async (req, res) => {
    try {
      let allFaqData = await FaqModel.find({})
      
      if (allFaqData) {
        // allFaqData=CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString()
        // console.log("allFaqData",CryptoJS.AES.encrypt(JSON.stringify(allFaqData), 'secret key 123').toString())
        return res.send({ success: "yes",
          message: "all faq data",allFaqData})
      } else {
        throw new Error("faq not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateFaqs = async (req, res) => {
  try {
   
    const updatedData = await FaqModel.findOneAndUpdate(
      { _id: { $eq: req.body.faq_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success: "yes", message:"faq updated", updatedData})
    } else {
      throw new Error("faq not updated")
    }
  } catch (error) {
    return res.status(400).send({success: "no", message: error.message });
  }
};

exports.deleteFaqs = async (req, res) => {
  try {
    const faqId = req.body.faq_id;
  
   
    const deletedData=await FaqModel.findOneAndDelete(
     {_id:{$eq:faqId}}
   )
    if (deletedData) {
      return res.send({success:"yes",message:"faq deleted",deletedData})
    } else {
      throw new Error("faq not deleted")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};