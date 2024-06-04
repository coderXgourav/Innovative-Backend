const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
    {
        category:{
            type: String,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
);

const GalleryModel = mongoose.model("GalleryModel", gallerySchema);

module.exports = GalleryModel;
