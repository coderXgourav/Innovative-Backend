const InvoiceModel = require("../models/invoiceModel");

const dotenv = require("dotenv");


exports.saveInvoices = async (req, res) => {
  try {
    let invoiceModel = new InvoiceModel();
    invoiceModel.company_name = req.body.company_name
    invoiceModel.company_address = req.body.company_address
    invoiceModel.company_phone_no = req.body.company_phone_no
    invoiceModel.company_email = req.body.company_email
    invoiceModel.invoice_no = req.body.invoice_no
    invoiceModel.invoice_date = req.body.invoice_date
    invoiceModel.shipping_address = req.body.shipping_address
    invoiceModel.billing_address = req.body.billing_address
    invoiceModel.tax = req.body.tax
    invoiceModel.details = req.body.details

    const insertedData = await invoiceModel.save()
    if (insertedData) {
      return res.send({success:"yes",message:"invoice inserted",insertedData})
    } else {
      throw new Error("invoice not created")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.updateInvoices = async (req, res) => {
  try {


    const updatedData = await InvoiceModel.findOneAndUpdate(
      { _id: { $eq: req.body.invoice_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (updatedData) {
      return res.send({success:"yes",message:"invoice updated",updatedData})
    } else {
      throw new Error("invoice not created")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.fetchInvoices = async (req, res) => {
  try {
    const fetchedData = await InvoiceModel.find({})
    if (fetchedData) {
      return res.send({success:"yes",message:"invoice fetched",fetchedData})
    } else {
      throw new Error("invoice not fetched")
    }


  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.deleteInvoices = async (req, res) => {
  try {
    const invoiceDocId = req.body.invoiceDocId;
  
    console.log(invoiceDocId)
    const deletedData=await InvoiceModel.findOneAndDelete(
     {_id:{$eq:invoiceDocId}}
   )
    if (deletedData) {
      return res.send({success:"yes",message:"invoice deleted",deletedData})
    } else {
      throw new Error("invoice not deleted")
    }


  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};