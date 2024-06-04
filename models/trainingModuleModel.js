const mongoose = require("mongoose");

const trainingModuleSchema = new mongoose.Schema(
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

const TrainingModuleModel = mongoose.model("TrainingModuleModel", trainingModuleSchema);

module.exports = TrainingModuleModel;
