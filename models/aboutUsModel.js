const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        } 
    },
    { timestamps: true }
);

const AboutUsModel = mongoose.model("AboutUsModel", aboutUsSchema);

module.exports = AboutUsModel;
