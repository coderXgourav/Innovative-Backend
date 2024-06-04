const ServiceModel = require("../models/serviceModel");
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
      fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

exports.saveServices = async (req, res) => {
  try {
    let serviceModel = new ServiceModel();
    serviceModel.name = req.body.name
    serviceModel.title = req.body.title
    serviceModel.description = req.body.description
    serviceModel.hover_title = req.body.hover_title
    serviceModel.hover_description = req.body.hover_description

    for (var i = 0; i < req.files.service.length; i++) {
      var locaFilePath = req.files.service[i].path;
      var locaFileName = req.files.service[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];


      if (imageExtensions.includes(locaFileName.split(".")[1])) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          serviceModel.image = resultImage.url;
        }
      }

    }

    const insertedData = await serviceModel.save()

    if (insertedData) {
      return res.send({success:"yes",insertedData})
    } else {
      throw new Error("service not created")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.fetchServices = async (req, res) => {
    try {
      const fetchedData = await ServiceModel.find({})
      if (fetchedData) {
        return res.send({
          success: "yes",
          message: "all service data", fetchedData
        })
      } else {
        throw new Error("service not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateServices = async (req, res) => {
    try{
      if (req.files && req.files.service && Array.isArray(req.files.service)) {
        for (var i = 0; i < req.files.service.length; i++) {
            var locaFilePath = req.files.service[i].path;
            var locaFileName = req.files.service[i].filename;
            let imageExtensions = ["png", "jpg", "jpeg", "gif"];
      
      
            if (imageExtensions.includes(locaFileName.split(".")[1])) {
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
  
      const updatedData = await ServiceModel.findOneAndUpdate(
        { _id: { $eq: req.body.service_id } },
        {
          ...req.body,
        },
        {
          new: true,
        }
      );
      if (updatedData) {
        return res.send({success:"yes",updatedData})
      } else {
        throw new Error("service not updated")
      }
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.deleteServices = async (req, res) => {
  try {
    const serviceId = req.body.service_id;
  
   
    const deletedData=await ServiceModel.findOneAndDelete(
     {_id:{$eq:serviceId}}
   )
    if (deletedData) {
      return res.send({success:"yes",deletedData})
    } else {
      throw new Error("service not deleted")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};