const mongoose = require("mongoose");

const emailUsSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        email: {
            type: String,
        },
        description: {
            type: String,
        } 
    },
    { timestamps: true }
);

const EmailUsModel = mongoose.model("EmailUsModel", emailUsSchema);

module.exports = EmailUsModel;
