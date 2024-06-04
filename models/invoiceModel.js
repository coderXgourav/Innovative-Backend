const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
    },
    company_address:{
        type:String,
    },
    company_phone_no:{
        type:String,
    },
    company_email:{
        type:String,
    },
    invoice_no:{
        type:String,
    },
    invoice_date:{
        type:String,
    },
    shipping_address:{
        type:String,
    },
    billing_address:{
        type:String,
    },
    tax:{
        type:String,
    },
    details:[{
        quantity:{
            type:String,
        },
        description:{
            type:String,
        },
        unit_price:{
            type:String,
        },
        total:{
            type:String,
        }
    }]
   
  },
  { timestamps: true }
);

const InvoiceModel = mongoose.model("InvoiceModel", invoiceSchema);

module.exports = InvoiceModel;
