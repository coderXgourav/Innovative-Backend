const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
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

exports.saveCategories = async (req, res) => {
  try {
    let categoryModel = new CategoryModel();

    categoryModel.name = req.body.name;

    for (var i = 0; i < req.files.category.length; i++) {
      var locaFilePath = req.files.category[i].path;
      var locaFileName = req.files.category[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];

      if (imageExtensions.includes(locaFileName.split(".")[1])) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          categoryModel.image = resultImage.url;
        }
      }
    }
    const insertedData = await categoryModel.save();
    if (insertedData) {
      return res.send({
        success: "no",
        message: "category inserted",
        insertedData,
      });
    } else {
      throw new Error("category not created");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.fetchCategories = async (req, res) => {
  try {
    const allCategoryData = await CategoryModel.find({});
    // .populate("file_templates").populate("mcq_templates").populate("quiz_templates")
    if (allCategoryData) {
      return res.send({
        success: "yes",
        message: "all category data",
        allCategoryData,
      });
    } else {
      throw new Error("categories not fetched");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    for (var i = 0; i < req.files.category.length; i++) {
      var locaFilePath = req.files.category[i].path;
      var locaFileName = req.files.category[i].filename;
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
    const updatedData = await CategoryModel.findOneAndUpdate(
      { _id: { $eq: req.body.category_id } },
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
        message: "category updated",
        updatedData,
      });
    } else {
      throw new Error("category not updated");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};

exports.deleteCategories = async (req, res) => {
  try {
    const catId = req.body.cat_id;

    const deletedCategoryData = await CategoryModel.findOneAndDelete({
      _id: { $eq: catId },
    });

    const deletedProductData = await ProductModel.deleteMany({
      category: { $eq: catId },
    });
    if (deletedCategoryData && deletedProductData) {
      return res.send({
        success: "yes",
        message: "category and all products related to this category deleted",
        deletedCategoryData,
        deletedProductData,
      });
    } else {
      throw new Error("category and products not deleted");
    }
  } catch (error) {
    return res.status(400).send({ success: "no", message: error.message });
  }
};
