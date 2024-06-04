const CusModel = require("../models/chooseUsModel");

const dotenv = require("dotenv");


exports.saveCus = async (req, res) => {
  try {
    let cusModel = new CusModel();
    cusModel.name = req.body.name
    cusModel.question = req.body.question
    cusModel.answer = req.body.answer
    

    const insertedData = await cusModel.save()
    if (insertedData) {
      return res.send({success:"yes",message:"choose us created",insertedData})
    } else {
      throw new Error("choose us item not created")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.fetchCus = async (req, res) => {
    try {
      const allCusData = await CusModel.find({})
      if (allCusData) {
        return res.send({ success: "yes",
          message: "all choose us data",allCusData})
      } else {
        throw new Error("choose us not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({success:"no", message: error.message });
    }
};

exports.updateCus = async (req, res) => {
  try {
   
    const updatedData = await CusModel.findOneAndUpdate(
      { _id: { $eq: req.body.cus_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success:"yes",message:"choose us updated",updatedData})
    } else {
      throw new Error("choose us item not updated")
    }
  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.deleteCus = async (req, res) => {
  try {
    const cusId = req.body.cus_id;
  
   
    const deletedData=await CusModel.findOneAndDelete(
     {_id:{$eq:cusId}}
   )
    if (deletedData) {
      return res.send({success:"yes",deletedData})
    } else {
      throw new Error("choose us item not deleted")
    }


  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};