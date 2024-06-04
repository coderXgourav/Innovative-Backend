const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        hover_title: {
            type: String,
        },
        hover_description: {
            type: String,
        },
    },
    { timestamps: true }
);

const ServiceModel = mongoose.model("ServiceModel", serviceSchema);

module.exports = ServiceModel;
