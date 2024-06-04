const mongoose = require("mongoose");

const callUsSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        phone_no: {
            type: Number,
        },
        description: {
            type: String,
        } 
    },
    { timestamps: true }
);

const CallUsModel = mongoose.model("CallUsModel", callUsSchema);

module.exports = CallUsModel;
