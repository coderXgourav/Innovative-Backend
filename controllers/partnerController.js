const PartnerModel = require("../models/partnerModel")
const fs = require("fs");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");


dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(locaFileName, locaFilePath) {
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName,
      folder: "images/",
      use_filename: true,
    })
    .then((result) => {
      // if(result.secure_url){
      // fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
      // }
    })
    .catch((error) => {
      // fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

exports.savePartners= async (req, res) => {
  try {
    const partnerModel = new PartnerModel();
    partnerModel.name=req.body.name

        for (var i = 0; i < req.files.partner.length; i++) {
          var locaFilePath = req.files.partner[i].path;
          var locaFileName = req.files.partner[i].filename;
          let imageExtensions = ["png", "jpg", "jpeg", "gif"];

          if (imageExtensions.includes(locaFileName.split(".")[1])) {
            var resultImage = await uploadImageToCloudinary(
              locaFileName,
              locaFilePath
            );
            if (resultImage) {
              partnerModel.image=resultImage.url
            }
          }
        }
    

    const createdData = await partnerModel.save();
    if (createdData) {
      return res.status(200).send({success:"yes",message:"partner created",createdData});
    } else {
      throw new Error("partner created");
    }
  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.updatePartners = async (req, res) => {
  try {

    if(Array.isArray(req.files.partner)){
      for (var i = 0; i < req.files.partner.length; i++) {
        var locaFilePath = req.files.partner[i].path;
        var locaFileName = req.files.partner[i].filename;
        let imageExtensions = ["png", "jpg", "jpeg", "gif"];
  
        if (imageExtensions.includes(req.files.partner[i].mimetype.split("/")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          if (resultImage) {
            req.body.image = resultImage.url;
          }
        }
      }
      }
  
      const updatedData = await PartnerModel.findOneAndUpdate(
        { _id: { $eq: req.body.partner_id } },
        {
          ...req.body,
        },
        {
          new: true,
        }
      );
      if (updatedData) {
        return res.send({success:"yes",message:"partner updated",updatedData})
      } else {
        throw new Error("partner not updated")
      }


   

  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
}

exports.getPartners = async (req, res) => {
  try {
    const allPartnerData = await PartnerModel.find({});

    if (allPartnerData) {
      return res.status(200).send({success:"yes",message:"all partner data",allPartnerData});
    }
    throw new Error("partners data not found");
  } catch (error) {
    res.status(400).send({ success:"no",message: error.message });
  }
};

exports.deletePartners = async (req, res) => {
  try {
    const partnerId = req.body.partner_id;

    const deletedData = await PartnerModel.findOneAndDelete(
      { _id: { $eq: partnerId } }
    )

    if (deletedData) {
      return res.status(200).send({success:"yes", message: "partner deleted successfully",deletedData })
    } else {
      throw new Error("cannot delete partner")
    }

  } catch (error) {
    res.status(400).send({ success:"no",message: error.message });
  }
}