const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
    {
        purchase_order_no: {
            type: Number,
        },
        purchase_order_date: {
            type: String,
        },
        company_logo:{
            type: String,
        },
        company_name: {
            type: String,
        },
        company_address: {
            type: String,
        },
        company_phone_no: {
            type: String,
        },
        company_email: {
            type: String,
        },
        billing_name: {
            type: String,
        },
        billing_phone_no: {
            type: String,
        },
        billing_email: {
            type: String,
        },
        billing_address: {
            type: String,
        },
        gratuity: {
            type: Number,
        },
        shipping_charges: {
            type: Number,
        },
        convenience_fee: {
            type: Number,
        },
        courier_charges: {
            type: Number,
        },
        deduction: {
            type: Number,
        },
        delivery_charges: {
            type: Number,
        },
        retention: {
            type: Number,
        },
        round_off: {
            type: Number,
        },
        notes: {
            type: String,
        },
        terms_condition: {
            type: String,
        },
        details: [{
            description:{
                type: String,
            },
            quantity: {
                type: Number,
            },
            rate: {
                type: Number,
            },
            discount: {
                type: Number,
            },
            gst: {
                type: Number,
            }
        }]

    },
    { timestamps: true }
);

const PurchaseOrderModel = mongoose.model("PurchaseOrderModel", purchaseOrderSchema);

module.exports = PurchaseOrderModel;
