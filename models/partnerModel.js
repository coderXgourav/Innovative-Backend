const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    image:{
        type: String,
    }
  },
  { timestamps: true }
);

const PartnerModel = mongoose.model("PartnerModel", partnerSchema);

module.exports = PartnerModel;
