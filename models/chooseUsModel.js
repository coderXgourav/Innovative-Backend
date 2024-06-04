const mongoose = require("mongoose");

const chooseUsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        question: {
            type: String,
        },
        answer: {
            type: String,
        }
    },
    { timestamps: true }
);

const CusModel = mongoose.model("CusModel", chooseUsSchema);

module.exports = CusModel;

