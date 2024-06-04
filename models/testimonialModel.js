const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        user_details: [{
                user_name: {
                    type: String,
                },
                // image: {
                //     type: String,
                // },
                description: {
                    type: String,
                },
                profession: {
                    type: String,
                }
            }]
    },
    { timestamps: true }
);

const TestimonialModel = mongoose.model("TestimonialModel", testimonialSchema);

module.exports = TestimonialModel;

