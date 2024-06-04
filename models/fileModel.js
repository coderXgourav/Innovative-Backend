const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    template_name: {
      type: String,
    },
    template_image: {
      type: String,
    },
    template_desc: {
      type: String,
    },
    template_pdfs: [
      {
        file_name: {
          type: String,
          // unique:true
        },
        pdf_title: {
          type: String,
        },
        url: {
          type: String,
        },
        watermark: {
          type: Boolean,
        },
        top_left_logo: {
          type: Boolean,
        },
        bottom_right_page_no: {
          type: Boolean,
        },
        pdf_downloadable: {
          type: Boolean,
        },
      },
    ],
    template_zips: [
      {
        file_name: {
          type: String,
          // unique:true
        },
        zip_title: {
          type: String,
        },
        url: {
          type: String,
        },
        zip_downloadable: {
          type: Boolean,
        },
      },
    ],
    template_links: [
      {
        link_preview_name: {
          type: String,
        },
        link_url: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const FileModel = mongoose.model("FileModel", fileSchema);

module.exports = FileModel;
