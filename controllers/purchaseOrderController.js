const PurchaseOrderModel = require("../models/purchaseOrderModel");
const fs = require("fs");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");


dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



async function uploadToCloudinary(locaFileName, locaFilePath) {
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

exports.savePurchaseOrders = async (req, res) => {
  try {
    let purchaseOrderModel = new PurchaseOrderModel();


    for (let i = 0; i < req.files.length; i++) {
      let locaFilePath = req.files[i].path;
      let locaFileName = req.files[i].filename;

     
        let result = await uploadToCloudinary(locaFileName, locaFilePath);
        if(result.url){
          purchaseOrderModel.company_logo=result.url
        }
      
    }

      

    // console.log("55",req.body)
    let tempAddData=JSON.parse(req.body.data)    
    purchaseOrderModel.company_name = tempAddData.company_name
    purchaseOrderModel.company_address = tempAddData.company_address
    purchaseOrderModel.company_phone_no = tempAddData.company_phone_no
    purchaseOrderModel.company_email = tempAddData.company_email

    purchaseOrderModel.purchase_order_no = tempAddData.purchase_order_no
    purchaseOrderModel.purchase_order_date = tempAddData.purchase_order_date

    purchaseOrderModel.billing_name = tempAddData.billing_name
    purchaseOrderModel.billing_phone_no = tempAddData.billing_phone_no
    purchaseOrderModel.billing_email = tempAddData.billing_email
    purchaseOrderModel.billing_address = tempAddData.billing_address

    purchaseOrderModel.gratuity = tempAddData.gratuity
    purchaseOrderModel.shipping_charges = tempAddData.shipping_charges
    purchaseOrderModel.convenience_fee = tempAddData.convenience_fee
    purchaseOrderModel.courier_charges = tempAddData.courier_charges

    purchaseOrderModel.deduction = tempAddData.deduction
    purchaseOrderModel.delivery_charges = tempAddData.delivery_charges
    purchaseOrderModel.retention = tempAddData.retention
    purchaseOrderModel.round_off = tempAddData.round_off

    purchaseOrderModel.details = tempAddData.details

    purchaseOrderModel.terms_condition = tempAddData.terms_condition
    purchaseOrderModel.notes = tempAddData.notes

    const insertedData = await purchaseOrderModel.save()
    if (insertedData) {
      return res.send({success:"yes",insertedData})
    } else {
      throw new Error("purchase order not created")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.fetchPurchaseOrders= async (req, res) => {
  try {
    const fetchedData = await PurchaseOrderModel.find({})
    if (fetchedData) {
      return res.send({success:"yes",fetchedData})
    } else {
      throw new Error("purchase orders not fetched")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.updatePurchaseOrders = async (req, res) => {
  try {

    let companyLogo=""

    if(req.files){
    for (let i = 0; i < req.files.length; i++) {
      let locaFilePath = req.files[i].path;
      let locaFileName = req.files[i].filename;

     
        let result = await uploadToCloudinary(locaFileName, locaFilePath);
        if(result.url){
          companyLogo=result.url
        }
      
    }
  }
      

    let tempUpdateData=JSON.parse(req.body.data)



    req.body={}

    req.body=tempUpdateData
    req.body.company_logo=companyLogo

    const updatedData = await PurchaseOrderModel.findOneAndUpdate(
      { _id: { $eq: req.body.purchase_order_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (updatedData) {
      return res.send({success:"yes",updatedData:updatedData})
    } else {
      throw new Error("purchase orders not updated")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.deletePurchaseOrders = async (req, res) => {
  try {
   
    const deletedData=await PurchaseOrderModel.findOneAndDelete(
     {_id:{$eq: req.body.poId}}
   )
    if (deletedData) {
      return res.send({success:"yes",deletedData})
    } else {
      throw new Error("purchase orders not deleted")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};