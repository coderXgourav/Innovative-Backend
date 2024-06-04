const mongoose = require("mongoose");

const ourVisionSchema = new mongoose.Schema(
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

const OurVisionModel = mongoose.model("OurVisionModel", ourVisionSchema);

module.exports = OurVisionModel;
