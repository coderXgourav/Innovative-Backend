const TestimonialModel = require("../models/testimonialModel");
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

exports.saveTestimonials = async (req, res) => {
  try {
    let testimonialModel = new TestimonialModel();
    // console.log("vvv",req.body.user_details)
    testimonialModel.name=req.body.name
    testimonialModel.user_details = JSON.parse(req.body.user_details)



    // for (var i = 0; i < req.files.testimonial.length; i++) {
    //   var locaFilePath = req.files.testimonial[i].path;
    //   var locaFileName = req.files.testimonial[i].filename;
    //   let imageExtensions = ["png", "jpg", "jpeg", "gif"];


    //   if (imageExtensions.includes(locaFileName.split(".")[1])) {
    //     var resultImage = await uploadImageToCloudinary(
    //       locaFileName,
    //       locaFilePath
    //     );
    //     if (resultImage) {
    //       testimonialModel.image = resultImage.url;
    //     }
    //   }

    // }
    const insertedData = await testimonialModel.save()
    if (insertedData) {
      return res.send({success:"yes",insertedData})
    } else {
      throw new Error("product not created")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.fetchTestimonials = async (req, res) => {
  try {
    const fetchedData = await TestimonialModel.find({})
    if (fetchedData) {
      return res.send({
        success: "yes",
        message: "all product data", 
        fetchedData
      })
    } else {
      throw new Error("product not fetched")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.updateTestimonials = async (req, res) => {
  try {

    // if (req.files && req.files.testimonial && Array.isArray(req.files.testimonial)) {
    //   for (var i = 0; i < req.files.testimonial.length; i++) {
    //     var locaFilePath = req.files.testimonial[i].path;
    //     var locaFileName = req.files.testimonial[i].filename;
    //     let imageExtensions = ["png", "jpg", "jpeg", "gif"];


    //     if (imageExtensions.includes(locaFileName.split(".")[1])) {
    //       var resultImage = await uploadImageToCloudinary(
    //         locaFileName,
    //         locaFilePath
    //       );
    //       if (resultImage) {
    //         req.body.image = resultImage.url;
    //       }
    //     }

    //   }
    
    // }
    
    req.body.user_details = JSON.parse(req.body.user_details)

    const updatedData = await TestimonialModel.findOneAndUpdate(
      { _id: { $eq: req.body.testimonial_id } },
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
      throw new Error("testimonial not updated")
    }
  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.deleteTestimonials = async (req, res) => {
  try {
    const tmId = req.body.testimonial_id;
  
   
    const deletedData=await TestimonialModel.findOneAndDelete(
     {_id:{$eq:tmId}}
   )
    if (deletedData) {
      return res.send({success:"yes",deletedData})
    } else {
      throw new Error("testimonial  not deleted")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};