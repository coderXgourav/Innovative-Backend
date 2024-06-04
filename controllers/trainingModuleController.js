const TrainingModuleModel = require("../models/trainingModuleModel");
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

exports.saveTraingModules = async (req, res) => {
  try {
    let trainingModuleModel = new TrainingModuleModel();
    trainingModuleModel.name = req.body.name
    trainingModuleModel.title = req.body.title
    trainingModuleModel.description = req.body.description
    trainingModuleModel.hover_title = req.body.hover_title
    trainingModuleModel.hover_description = req.body.hover_description

    for (var i = 0; i < req.files.trainingModule.length; i++) {
      var locaFilePath = req.files.trainingModule[i].path;
      var locaFileName = req.files.trainingModule[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];


      if (imageExtensions.includes(locaFileName.split(".")[1])) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          trainingModuleModel.image = resultImage.url;
        }
      }

    }

    const insertedData = await trainingModuleModel.save()

    if (insertedData) {
      return res.send({success:"yes",insertedData})
    } else {
      throw new Error("training module not created")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.fetchTraingModules = async (req, res) => {
    try {
      const fetchedData = await TrainingModuleModel.find({})
      if (fetchedData) {
        return res.send({
          success: "yes",
          message: "all trining module data", fetchedData
        })
      } else {
        throw new Error("training module not fetched")
      }
  
  
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.updateTraingModules = async (req, res) => {
    try{
      if (req.files && req.files.trainingModule && Array.isArray(req.files.trainingModule)) {
        for (var i = 0; i < req.files.trainingModule.length; i++) {
            var locaFilePath = req.files.trainingModule[i].path;
            var locaFileName = req.files.trainingModule[i].filename;
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
  
      const updatedData = await TrainingModuleModel.findOneAndUpdate(
        { _id: { $eq: req.body.module_id } },
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
        throw new Error("training module not updated")
      }
    } catch (error) {
      return res.status(400).send({ success:"no",message: error.message });
    }
};

exports.deleteTrainingModules = async (req, res) => {
  try {
    const moduleId = req.body.module_id;
  
   
    const deletedData=await TrainingModuleModel.findOneAndDelete(
     {_id:{$eq:moduleId}}
   )
    if (deletedData) {
      return res.send({success:"yes",deletedData})
    } else {
      throw new Error("module not deleted")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};