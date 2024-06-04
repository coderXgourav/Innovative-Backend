const TemplateModel = require("../models/fileModel");
const fs = require("fs");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("12345");

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPdfToCloudinary(locaFileName, locaFilePath) {
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName,
      folder: "pdfs/",
      use_filename: true,
    })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

async function uploadImageToCloudinary(locaFileName, locaFilePath) {
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName,
      folder: "images/",
      use_filename: true,
    })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

async function uploadZipToCloudinary(locaFileName, locaFilePath) {
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName,
      folder: "zips/",
      use_filename: true,
      resource_type: "auto",
    })
    .then((result) => {
      fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

exports.saveTemplates = async (req, res) => {
  try {
    // console.log("loop", req.body)

    const templateModel = new TemplateModel();

    let getPdfs = [];
    let getZips = [];
    let getLinks = [];

    let waterMarkInd = 0;
    let logoInd = 0;
    let pageNoInd = 0;
    let pdfDownloadableInd = 0;
    let zipDownloadableInd = 0;
    let pdfTitleInd = 0;
    let zipTitleInd = 0;

    for (var i = 0; i < req.files.length; i++) {
      var locaFilePath = req.files[i].path;
      var locaFileName = req.files[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];

      if (locaFileName.split(".")[1] === "pdf") {
        var resultPdf = await uploadPdfToCloudinary(locaFileName, locaFilePath);
        if (resultPdf) {
          getPdfs.push({
            file_name: locaFileName,
            url: cryptr.encrypt(resultPdf.url),
            pdf_title: Array.isArray(req.body.pdf_title)
              ? pdfTitleInd < req.body.pdf_title.length
                ? req.body.pdf_title[pdfTitleInd++]
                : " "
              : req.body.pdf_title,
            watermark: Array.isArray(req.body.watermark)
              ? waterMarkInd < req.body.watermark.length
                ? req.body.watermark[waterMarkInd++]
                : " "
              : req.body.watermark,
            top_left_logo: Array.isArray(req.body.top_left_logo)
              ? logoInd < req.body.top_left_logo.length
                ? req.body.top_left_logo[logoInd++]
                : " "
              : req.body.top_left_logo,
            bottom_right_page_no: Array.isArray(req.body.bottom_right_page_no)
              ? pageNoInd < req.body.bottom_right_page_no.length
                ? req.body.bottom_right_page_no[pageNoInd++]
                : " "
              : req.body.bottom_right_page_no,
            pdf_downloadable: Array.isArray(req.body.pdf_downloadable)
              ? pdfDownloadableInd < req.body.pdf_downloadable.length
                ? req.body.pdf_downloadable[pdfDownloadableInd++]
                : " "
              : req.body.pdf_downloadable,
          });
        }
      }
      if (imageExtensions.includes(locaFileName.split(".")[1])) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          templateModel.template_image = resultImage.url;
        }
      }
      if (locaFileName.split(".")[1] === "zip") {
        var resultZip = await uploadZipToCloudinary(locaFileName, locaFilePath);
        if (resultZip) {
          getZips.push({
            file_name: locaFileName,
            url: cryptr.encrypt(resultZip.url),
            zip_title: Array.isArray(req.body.zip_title)
              ? zipTitleInd < req.body.zip_title.length
                ? req.body.zip_title[zipTitleInd++]
                : " "
              : req.body.zip_title,
            zip_downloadable: Array.isArray(req.body.zip_downloadable)
              ? zipDownloadableInd < req.body.zip_downloadable.length
                ? req.body.zip_downloadable[zipDownloadableInd++]
                : " "
              : req.body.zip_downloadable,
          });
        }
      }
    }

    if (
      req.body.link_preview_name &&
      Array.isArray(req.body.link_preview_name)
    ) {
      for (let i = 0; i < req.body.link_preview_name.length; i++) {
        getLinks.push({ link_preview_name: req.body.link_preview_name[i] });
      }
    } else if (req.body.link_preview_name) {
      getLinks.push({ link_preview_name: req.body.link_preview_name });
    }

    if (req.body.link_url && Array.isArray(req.body.link_url)) {
      for (let i = 0; i < req.body.link_url.length; i++) {
        getLinks[i].link_url = req.body.link_url[i];
      }
    } else if (req.body.link_url) {
      getLinks[0].link_url = req.body.link_url;
    }

    templateModel.template_name = req.body.template_name;
    templateModel.template_desc = req.body.template_desc;
    templateModel.template_pdfs = getPdfs;
    templateModel.template_zips = getZips;
    templateModel.template_links = getLinks;

    const insertedTemplateData = await templateModel.save();

    insertedTemplateData.template_pdfs.forEach((pdf) => {
      pdf.url = cryptr.decrypt(pdf.url);
    });

    insertedTemplateData.template_zips.forEach((zip) => {
      zip.url = cryptr.decrypt(zip.url);
    });

    if (insertedTemplateData) {
      return res.status(200).send({success:"yes",message:"file created",insertedTemplateData});
    } else {
      throw new Error("cannot insert data in db");
    }
  } catch (error) {
    res.status(400).send({success:"no", message: error.message });
  }
};

exports.getTemplates = async (req, res) => {
  try {
    const allTemplates = await TemplateModel.find({});
    allTemplates.forEach((temp) => {
      temp.template_pdfs.forEach((pdf) => {
        pdf.url = cryptr.decrypt(pdf.url);
      });

      temp.template_zips.forEach((zip) => {
        zip.url = cryptr.decrypt(zip.url);
      });
    });

    if (allTemplates) {
      return res.status(200).send({success:"yes",message:"all file templates",allTemplates});
    }
    throw new Error("templates not found");
  } catch (error) {
    res.status(400).send({success:"no", message: error.message });
  }
};

exports.updateTemplates = async (req, res) => {
  try {
    const templateId = req.body.templateId;

    let getPdfs = [];
    let getZips = [];
    let getLinks = [];
    let allPdfs = [];
    let allZips = [];
    let allLinks = [];

    let waterMarkInd = 0;
    let logoInd = 0;
    let pageNoInd = 0;
    let pdfDownloadableInd = 0;
    let zipDownloadableInd = 0;
    let pdfTitleInd = 0;
    let zipTitleInd = 0;


    // update old files
    if (
      req.body.db_pdf_id &&
      Array.isArray(req.body.db_pdf_id) &&
      req.body.db_pdf_url &&
      Array.isArray(req.body.db_pdf_url) &&
      req.body.db_pdf_watermark &&
      Array.isArray(req.body.db_pdf_watermark) &&
      req.body.db_pdf_top_left_logo &&
      Array.isArray(req.body.db_pdf_top_left_logo) &&
      req.body.db_pdf_bottom_right_page_no &&
      Array.isArray(req.body.db_pdf_bottom_right_page_no) &&
      req.body.db_pdf_pdf_downloadable &&
      Array.isArray(req.body.db_pdf_pdf_downloadable)
    ) { 
        for (let i = 0; i < req.body.db_pdf_url.length; i++) {
          allPdfs.push({
            _id: req.body.db_pdf_id[i],
            url: cryptr.encrypt(req.body.db_pdf_url[i]),
            file_name: req.body.db_pdf_file_name[i],
            watermark: req.body.db_pdf_watermark[i],
            top_left_logo: req.body.db_pdf_top_left_logo[i],
            bottom_right_page_no: req.body.db_pdf_bottom_right_page_no[i],
            pdf_downloadable: req.body.db_pdf_pdf_downloadable[i],
          }); 
      }
    } else if (
      req.body.db_pdf_id &&
      req.body.db_pdf_url &&
      req.body.db_pdf_watermark &&
      req.body.db_pdf_top_left_logo &&
      req.body.db_pdf_bottom_right_page_no &&
      req.body.db_pdf_pdf_downloadable
    ) {
      allPdfs.push({
        _id: req.body.db_pdf_id,
        url: cryptr.encrypt(req.body.db_pdf_url),
        file_name: req.body.db_pdf_file_name,
        watermark: req.body.db_pdf_watermark,
        top_left_logo: req.body.db_pdf_top_left_logo,
        bottom_right_page_no: req.body.db_pdf_bottom_right_page_no,
        pdf_downloadable: req.body.db_pdf_pdf_downloadable,
      });
    }

    if (
      req.body.db_zip_id &&
      Array.isArray(req.body.db_zip_id) &&
      req.body.db_zip_url &&
      req.body.db_zip_zip_downloadable &&
      Array.isArray(req.body.db_zip_zip_downloadable)
    ) {
      
        for (let i = 0; i < req.body.db_zip_url.length; i++) {
          allZips.push({
            _id: req.body.db_zip_id[i],
            url: cryptr.encrypt(req.body.db_zip_url[i]),
            file_name: req.body.db_zip_file_name[i],
            zip_downloadable: req.body.db_zip_zip_downloadable[i],
          });
        
      }
    } else if (
      req.body.db_zip_id &&
      req.body.db_zip_url &&
      req.body.db_zip_zip_downloadable
    ) {
      allZips.push({
        _id: req.body.db_zip_id,
        url: cryptr.encrypt(req.body.db_zip_url),
        file_name: req.body.db_zip_file_name,
        zip_downloadable: req.body.db_zip_zip_downloadable,
      });
    }

    if (
      req.body.db_link_preview_name &&
      Array.isArray(req.body.db_link_preview_name) &&
      req.body.db_link_url &&
      Array.isArray(req.body.db_link_url)
    ) {
      
        for (let i = 0; i < req.body.db_link_preview_name.length; i++) {
          allLinks.push({
            _id: req.body.db_link_id[i],
            link_preview_name: req.body.db_link_preview_name[i],
            link_url: req.body.db_link_url[i],
          });
        
      }
    } else if (req.body.db_link_preview_name && req.body.db_link_url) {
      allLinks.push({
        _id: req.body.db_link_id,
        link_preview_name: req.body.db_link_preview_name,
        link_url: req.body.db_link_url,
      });
    }

    // new file addition
    for (var i = 0; i < req.files.length; i++) {
      var locaFilePath = req.files[i].path;
      var locaFileName = req.files[i].filename;
      let imageExtensions = ["png", "jpg", "jpeg", "gif"];

      if (locaFileName.split(".")[1] === "pdf") {
        var resultPdf = await uploadPdfToCloudinary(locaFileName, locaFilePath);
        if (resultPdf) {
          getPdfs.push({
            file_name: locaFileName,
            url: cryptr.encrypt(resultPdf.url),
            pdf_title: Array.isArray(req.body.pdf_title)
              ? pdfTitleInd < req.body.pdf_title.length
                ? req.body.pdf_title[pdfTitleInd++]
                : " "
              : req.body.pdf_title,
            watermark: Array.isArray(req.body.watermark)
              ? waterMarkInd < req.body.watermark.length
                ? req.body.watermark[waterMarkInd++]
                : " "
              : req.body.watermark,
            top_left_logo: Array.isArray(req.body.top_left_logo)
              ? logoInd < req.body.top_left_logo.length
                ? req.body.top_left_logo[logoInd++]
                : " "
              : req.body.top_left_logo,
            bottom_right_page_no: Array.isArray(req.body.bottom_right_page_no)
              ? pageNoInd < req.body.bottom_right_page_no.length
                ? req.body.bottom_right_page_no[pageNoInd++]
                : " "
              : req.body.bottom_right_page_no,
            pdf_downloadable: Array.isArray(req.body.pdf_downloadable)
              ? pdfDownloadableInd < req.body.pdf_downloadable.length
                ? req.body.pdf_downloadable[pdfDownloadableInd++]
                : " "
              : req.body.pdf_downloadable,
          });
        }
      }
      if (imageExtensions.includes(locaFileName.split(".")[1])) {
        var resultImage = await uploadImageToCloudinary(
          locaFileName,
          locaFilePath
        );
        if (resultImage) {
          req.body.template_image = resultImage.url;
        }
      }
      if (locaFileName.split(".")[1] === "zip") {
        var resultZip = await uploadZipToCloudinary(locaFileName, locaFilePath);
        if (resultZip) {
          getZips.push({
            file_name: locaFileName,
            url: cryptr.encrypt(resultZip.url),
            zip_title: Array.isArray(req.body.zip_title)
              ? zipTitleInd < req.body.zip_title.length
                ? req.body.zip_title[zipTitleInd++]
                : " "
              : req.body.zip_title,
            zip_downloadable: Array.isArray(req.body.zip_downloadable)
              ? zipDownloadableInd < req.body.zip_downloadable.length
                ? req.body.zip_downloadable[zipDownloadableInd++]
                : " "
              : req.body.zip_downloadable,
          });
        }
      }
    }

    if (
      req.body.link_preview_name &&
      Array.isArray(req.body.link_preview_name)
    ) {
      for (let i = 0; i < req.body.link_preview_name.length; i++) {
        getLinks.push({ link_preview_name: req.body.link_preview_name[i] });
      }
    } else if (req.body.link_preview_name) {
      getLinks.push({ link_preview_name: req.body.link_preview_name });
    }

    if (req.body.link_url && Array.isArray(req.body.link_url)) {
      for (let i = 0; i < req.body.link_url.length; i++) {
        getLinks[i].link_url = req.body.link_url[i];
      }
    } else if (req.body.link_url) {
      getLinks[0].link_url = req.body.link_url;
    }

    // marging
    if (getPdfs.length !== 0) {
      getPdfs.forEach((gp) => {
        allPdfs.push(gp);
      });
    }

    if (getZips.length !== 0) {
      getZips.forEach((gz) => {
        allZips.push(gz);
      });
    }

    if (getLinks.length !== 0) {
      getLinks.forEach((gl) => {
        allLinks.push(gl);
      });
    }

    let templateName = req.body.template_name;
    let templateDesc = req.body.template_desc;
    let templateImage=req.body.template_image
   

    // console.log("image",req.body.template_image)


    req.body = {};

    if (templateName) {
      req.body.template_name = templateName;
    }
    if (templateDesc) {
      req.body.template_desc = templateDesc;
    }
    if (templateImage) {
      req.body.template_image = templateImage;
    }
  

    if (allPdfs.length > 0) {
      req.body.template_pdfs = allPdfs;
    }

    if (allZips.length > 0) {
      req.body.template_zips = allZips;
    }

    if (allLinks.length > 0) {
      req.body.template_links = allLinks;
    }

    // console.log("rrr",req.body)
    
    const updatedTemplateData = await TemplateModel.findOneAndUpdate(
      { _id: { $eq: templateId } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (updatedTemplateData) {
      return res.status(200).send({success:"yes",message:"file templates updated successfully",updatedTemplateData});
    } else {
      throw new Error("cannot update the template");
    }
  } catch (error) {
    res.status(400).send({success:"no", message: error.message });
  }
};

exports.deleteTemplates=async(req,res)=>{
try{
  const templateId = req.body.templateId;

     const deletedData=await TemplateModel.findOneAndDelete(
      {_id:{$eq:templateId}}
    )

    if(deletedData){
      return res.status(200).send({success:"yes",message:"template deleted successfully"})
    }else{
      throw new Error("cannot delete template")
    }

}catch (error) {
    res.status(400).send({ success:"no",message: error.message });
  }
}
