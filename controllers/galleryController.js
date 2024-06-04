const GalleryModel = require("../models/galleryModel");
const fs = require("fs");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(locaFileName, locaFilePath) {
  // console.log("KOOP")
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName.split(".")[0],
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

exports.saveGallery = async (req, res) => {
  try {
    let galleryModel = new GalleryModel();
    galleryModel.name = req.body.name;
    galleryModel.category = req.body.category;

    for (var i = 0; i < req.files.gallery.length; i++) {
      var locaFilePath = req.files.gallery[i].path;
      var locaFileName = req.files.gallery[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];

      if (
        imageExtensions.includes(req.files.gallery[i].mimetype.split("/")[1])
      ) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          galleryModel.image = resultImage.url;
        }
      }
    }

    // console.log(")))", req.files)
    const insertedData = await galleryModel.save();
    if (insertedData) {
      return res.send({
        success: "yes",
        message: "gallery file created",
        insertedData,
      });
    } else {
      throw new Error("gallery not created");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.fetchGalleries = async (req, res) => {
  try {
    const allGalleryData = await GalleryModel.find({});
    if (allGalleryData) {
      return res.send({
        success: "yes",
        message: "all gallery data",
        allGalleryData,
      });
    } else {
      throw new Error("gallery not fetched");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    if (Array.isArray(req.files.gallery)) {
      for (var i = 0; i < req.files.gallery.length; i++) {
        var locaFilePath = req.files.gallery[i].path;
        var locaFileName = req.files.gallery[i].filename;
        let imageExtensions = ["png", "jpg", "jpeg", "gif"];

        if (
          imageExtensions.includes(req.files.gallery[i].mimetype.split("/")[1])
        ) {
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

    const updatedData = await GalleryModel.findOneAndUpdate(
      { _id: { $eq: req.body.gallery_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({
        success: "yes",
        message: "gallery updated",
        updatedData,
      });
    } else {
      throw new Error("gallery not updated");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const galleryId = req.body.gallery_id;

    const deletedData = await GalleryModel.findOneAndDelete({
      _id: { $eq: galleryId },
    });
    if (deletedData) {
      return res.send({success:"yes",message:"gallery file deleted",deletedData});
    } else {
      throw new Error("gallery not deleted");
    }
  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};
