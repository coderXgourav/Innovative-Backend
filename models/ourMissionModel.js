const mongoose = require("mongoose");

const ourMissionSchema = new mongoose.Schema(
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

const OurMissionModel = mongoose.model("OurMissionModel", ourMissionSchema);

module.exports = OurMissionModel;
