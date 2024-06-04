const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
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

const FaqModel = mongoose.model("FaqModel", faqSchema);

module.exports = FaqModel;
