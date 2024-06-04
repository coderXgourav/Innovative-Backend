const QuizModel = require("../models/quizModel")
const fs = require("fs");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");


dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(locaFileName, locaFilePath) {
  return cloudinary.v2.uploader
    .upload(locaFilePath, {
      public_id: locaFileName.split(".")[0],
      folder: "images/",
      use_filename: true,
    })
    .then((result) => {
      // if(result.secure_url){
      // fs.unlinkSync(locaFilePath);
      return {
        message: "Success",
        url: result.secure_url,
      };
      // }
    })
    .catch((error) => {
      // fs.unlinkSync(locaFilePath);
      console.log("cloudinary error", error);
      return { message: "Fail to upload in cloudinary" };
    });
}

exports.saveQuizTemplates = async (req, res) => {
  try {
    const quizModel = new QuizModel();
    let tempOptions = [];

    if (!req.body.paper_name) {
      return res.status(400).send({success:"no", message: "paper name required" });
    }

    if (req.body.options_type && Array.isArray(req.body.options_type)) {
      let imgOptStartIndex = 0;
      let imgOptEndIndex = 4;
      let textOptStartIndex = 0;
      let textOptEndIndex = 4;

      for (let ot = 0; ot < req.body.options_type.length; ot++) {
        if (req.body.options_type[ot] === "image") {
          for (var i = imgOptStartIndex; i < imgOptEndIndex; i++) {
            var locaFilePath = req.files.options[i].path;
            var locaFileName = req.files.options[i].filename;
            let imageExtensions = ["png", "jpg", "jpeg", "gif"];

            if (imageExtensions.includes(locaFileName.split(".")[1])) {
              var resultImage = await uploadImageToCloudinary(
                locaFileName,
                locaFilePath
              );
              if (resultImage) {
                tempOptions.push(resultImage.url);
              }
            }
          }

          imgOptStartIndex = imgOptEndIndex;
          imgOptEndIndex = imgOptEndIndex + 4;
        } else if (req.body.options_type[ot] === "text") {
          if (req.body.text_options && Array.isArray(req.body.text_options)) {
            for (var i = textOptStartIndex; i < textOptEndIndex; i++) {
              tempOptions.push(req.body.text_options[i]);
            }
            textOptStartIndex = textOptEndIndex;
            textOptEndIndex = textOptEndIndex + 4;
          }
        }
      }
    } else if (req.body.options_type) {
      if (req.body.options_type === "image") {
        for (var i = 0; i < req.files.options.length; i++) {
          var locaFilePath = req.files.options[i].path;
          var locaFileName = req.files.options[i].filename;
          let imageExtensions = ["png", "jpg", "jpeg", "gif"];

          if (imageExtensions.includes(locaFileName.split(".")[1])) {
            var resultImage = await uploadImageToCloudinary(
              locaFileName,
              locaFilePath
            );
            if (resultImage) {
              tempOptions.push(resultImage.url);
            }
          }
        }
      } else if (req.body.options_type === "text") {
        if (req.body.text_options) {
          req.body.text_options.forEach((op) => {
            tempOptions.push(op);
          });
        }
      }
    }

    // all options in tempOptions

    quizModel.paper_name = req.body.paper_name;

    
    var locaFilePath = req.files.banner[0].path;
    var locaFileName = req.files.banner[0].filename;

    let imageExtensions = ["png", "jpg", "jpeg", "gif"];
   
    if (imageExtensions.includes(locaFileName.split(".")[1])) {
      var resultImage = await uploadImageToCloudinary(
        locaFileName,
        locaFilePath
      );
      if (resultImage) {
        quizModel.banner=resultImage.url
      }
    }

    if (req.body.question && Array.isArray(req.body.question)) {
      let tempOptStartInd = 0;
      let tempOptEndInd = 4;

      for (let i = 0; i < req.body.question.length; i++) {
        quizModel.quizzes.push({
          question: "",
          answer: "",
          options_type: "",
          options: [],
        });
        quizModel.quizzes[i].question = req.body.question[i];

        quizModel.quizzes[i].options_type = req.body.options_type[i];
        // quizModel.quizzes[i].mark = req.body.mark[i];
        quizModel.quizzes[i].explaination = req.body.explaination[i];

        if (quizModel.quizzes[i].options_type === "text") {
          quizModel.quizzes[i].answer = JSON.parse(req.body.answer_text)[i];
        }

        if (quizModel.quizzes[i].options_type === "image") {
          var locaFilePath = ""
          var locaFileName = ""
          // console.log("132",req.files)
          if (i > req.files.answers.length - 1) {
            locaFilePath = req.files.answers[i - 1].path;
            locaFileName = req.files.answers[i - 1].filename;
          } else {
            locaFilePath = req.files.answers[i].path;
            locaFileName = req.files.answers[i].filename;
          }
          let imageExtensions = ["png", "jpg", "jpeg", "gif"];
          if (imageExtensions.includes(locaFileName.split(".")[1])) {
            var resultImage = await uploadImageToCloudinary(
              locaFileName,
              locaFilePath
            );
            if (resultImage) {
              quizModel.quizzes[i].answer = resultImage.url;
            }
          }
        }
        for (let j = tempOptStartInd; j < tempOptEndInd; j++) {
          quizModel.quizzes[i].options.push(tempOptions[j]);
        }
        tempOptStartInd = tempOptEndInd;
        tempOptEndInd = tempOptEndInd + 4;
      }
    } else if (req.body.question) {
      quizModel.quizzes.push({
        question: "",
        answer: "",
        options_type: "",
        options: [],
      });
      quizModel.quizzes[0].question = req.body.question;
      if (req.body.options_type === "text") {
        quizModel.quizzes[0].answer = JSON.parse(req.body.answer_text)[0];;
      }

      if (req.body.options_type === "image") {
        var locaFilePath = req.files.answers[req.files.answers.length - 1].path;
        var locaFileName = req.files.answers[req.files.answers.length - 1].filename;
        let imageExtensions = ["png", "jpg", "jpeg", "gif"];
        let tempAnswer = [];
        if (imageExtensions.includes(locaFileName.split(".")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          if (resultImage) {
            tempAnswer.push(resultImage.url);
          }
        }

        quizModel.quizzes[0].answer = tempAnswer[0];
      }
      quizModel.quizzes[0].options_type = req.body.options_type;
      // quizModel.quizzes[0].mark = req.body.mark;
      quizModel.quizzes[0].explaination = req.body.explaination;
      // for (let j = 0; j < 4; j++) {
        quizModel.quizzes[0].options=tempOptions;
      // }
    }

    const createdMcqData = await quizModel.save();
    if (createdMcqData) {
      return res.status(200).send({success:"yes",createdMcqData});
    } else {
      throw new Error("quiz set created");
    }
  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.updateQuizTemplates = async (req, res) => {
  try {


    let updatedPaperNameAndBanner = undefined

    if (req.body.paper_name) {

      if (req.files.banner && Array.isArray(req.files.banner)) {
        var locaFilePath = req.files.banner[0].path;
        var locaFileName = req.files.banner[0].filename;

        let imageExtensions = ["png", "jpg", "jpeg", "gif"];

        if (imageExtensions.includes(locaFileName.split(".")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          if (resultImage) {
            req.body.banner = resultImage.url
          }
        }
      }
      // console.log("paper name")

      if (req.body.banner) {
        updatedPaperNameAndBanner = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              "paper_name": req.body.paper_name,
              "banner": req.body.banner,
            }
          },
          { returnDocument: "after" }
        )

      }
      else {
        updatedPaperNameAndBanner = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              "paper_name": req.body.paper_name,
              //  "banner": req.body.banner,
            }
          },
          { returnDocument: "after" })
      }

      // console.log(updatedPaperName)
    }

    let updateData = JSON.parse(req.body.updated_data)
    let isDataUpdated = undefined
    let dbImgOptionsIndex = 0
    let dbImgAnswersIndex = 0

    for (let k = 0; k < updateData.length; k++) {
      if (updateData[k].db_options_replacable_option_type && updateData[k].db_options_replacable_option_type === "image") {
        locaFilePath = req.files.db_options[dbImgOptionsIndex].path;
        locaFileName = req.files.db_options[dbImgOptionsIndex].filename;
        let imageExtensions = ["png", "jpg", "jpeg", "gif"];
        if (imageExtensions.includes(locaFileName.split(".")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          if (resultImage) {
            const updatedDataImgOpt = await QuizModel.findOneAndUpdate(
              { _id: req.body.quizDocId },
              {
                $set: {
                  [`quizzes.${updateData[k].db_options_replacable_question_no}.options.${updateData[k].db_options_replacable_option_index}`]: resultImage.url,
                }
              },
              { returnDocument: "after" }
            );
            if (updatedDataImgOpt) {
              isDataUpdated = "yes"
              dbImgOptionsIndex++
            } else {
              isDataUpdated = "no"
            }
          }
        }
      }


      if (updateData[k].db_options_text_replacable_option_type && updateData[k].db_options_text_replacable_option_type === "text") {

        const updatedDataTextOpt = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              [`quizzes.${updateData[k].db_options_text_replacable_question_no}.options.${updateData[k].db_options_text_replacable_option_index}`]: updateData[k].db_options_text_data,
            }
          },
          { returnDocument: "after" }
        );
        if (updatedDataTextOpt) {
          isDataUpdated = "yes"

        } else {
          isDataUpdated = "no"
        }

      }


      if (updateData[k].db_image_answer_replacable_option_type&&updateData[k].db_image_answer_replacable_option_type==="image") {
        locaFilePath = req.files.db_answers[dbImgAnswersIndex].path;
        locaFileName = req.files.db_answers[dbImgAnswersIndex].filename;


        let imageExtensions = ["png", "jpg", "jpeg", "gif"];


        if (imageExtensions.includes(locaFileName.split(".")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          // console.log("url",resultImage.url)
          if (resultImage) {
            const updatedDataImgAns = await QuizModel.findOneAndUpdate(
              { _id: req.body.quizDocId },
              {
                $set: {
                  [`quizzes.${updateData[k].db_answers_replacable_question_no}.answer`]: resultImage.url,
                }
              },
              { returnDocument: "after" }
            );
            if (updatedDataImgAns) {
              isDataUpdated = "yes"
              dbImgAnswersIndex++
            } else {
              isDataUpdated = "no"
            }
          }
        }



      }


      if (updateData[k].db_text_answer_replacable_option_type && updateData[k].db_text_answer_replacable_option_type === "text") {







        const updatedDataTextAns = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              [`quizzes.${updateData[k].db_text_answer_replacable_question_no}.answer`]: updateData[k].db_text_answer_data,
            }
          },
          { returnDocument: "after" }
        );
        // console.log("OOO",updateDataRR.quizzes[1].options)
        if (updatedDataTextAns) {
          isDataUpdated = "yes"

        } else {
          isDataUpdated = "no"
        }

      }


      // if (updateData[k].db_marks_replacable_option_type && updateData[k].db_marks_replacable_option_type === "text") {







      //   const updatedDataMarks = await quizModel.findOneAndUpdate(
      //     { _id: req.body.quizDocId },
      //     {
      //       $set: {
      //         [`quizzes.${updateData[k].db_marks_replacable_question_no}.mark`]: updateData[k].db_marks_data,
      //       }
      //     },
      //     { returnDocument: "after" }
      //   );
      //   // console.log("OOO",updateDataRR.quizzes[1].options)
      //   if (updatedDataMarks) {
      //     isDataUpdated = "yes"

      //   } else {
      //     isDataUpdated = "no"
      //   }

      // }

      if (updateData[k].db_explaination_replacable_option_type && updateData[k].db_explaination_replacable_option_type === "text") {







        const updatedDataExp = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              [`quizzes.${updateData[k].db_explaination_replacable_question_no}.explaination`]: updateData[k].db_explaination_data,
            }
          },
          { returnDocument: "after" }
        );
        // console.log("OOO",updateDataRR.quizzes[1].options)
        if (updatedDataExp) {
          isDataUpdated = "yes"

        } else {
          isDataUpdated = "no"
        }

      }


      if (updateData[k].db_questions_replacable_option_type && updateData[k].db_questions_replacable_option_type === "text") {







        const updatedDataQues = await QuizModel.findOneAndUpdate(
          { _id: req.body.quizDocId },
          {
            $set: {
              [`quizzes.${updateData[k].db_questions_replacable_question_no}.explaination`]: updateData[k].db_questions_data,
            }
          },
          { returnDocument: "after" }
        );
        // console.log("OOO",updateDataRR.quizzes[1].options)
        if (updatedDataQues) {
          isDataUpdated = "yes"

        } else {
          isDataUpdated = "no"
        }

      }

    }

    //add new data

    const quizDocData = await QuizModel.findById(req.body.quizDocId);
    // console.log("prev",quizDocData)

    let tempOptions = [];
    let tempQuizLength = quizDocData.quizzes.length

    if (req.body.options_type && Array.isArray(req.body.options_type)) {
      let imgOptStartIndex = 0;
      let imgOptEndIndex = 4;
      let textOptStartIndex = 0;
      let textOptEndIndex = 4;

      for (let ot = 0; ot < req.body.options_type.length; ot++) {
        if (req.body.options_type[ot] === "image") {
          for (var i = imgOptStartIndex; i < imgOptEndIndex; i++) {
            var locaFilePath = req.files.options[i].path;
            var locaFileName = req.files.options[i].filename;
            let imageExtensions = ["png", "jpg", "jpeg", "gif"];

            if (imageExtensions.includes(locaFileName.split(".")[1])) {
              var resultImage = await uploadImageToCloudinary(
                locaFileName,
                locaFilePath
              );
              if (resultImage) {
                tempOptions.push(resultImage.url);
              }
            }
          }

          imgOptStartIndex = imgOptEndIndex;
          imgOptEndIndex = imgOptEndIndex + 4;
        } else if (req.body.options_type[ot] === "text") {
          if (req.body.text_options && Array.isArray(req.body.text_options)) {
            for (var i = textOptStartIndex; i < textOptEndIndex; i++) {
              tempOptions.push(req.body.text_options[i]);
            }
            textOptStartIndex = textOptEndIndex;
            textOptEndIndex = textOptEndIndex + 4;
          }
        }
      }
    } else if (req.body.options_type) {
      if (req.body.options_type === "image") {
        for (var i = 0; i < req.files.options.length; i++) {
          var locaFilePath = req.files.options[i].path;
          var locaFileName = req.files.options[i].filename;
          let imageExtensions = ["png", "jpg", "jpeg", "gif"];

          if (imageExtensions.includes(locaFileName.split(".")[1])) {
            var resultImage = await uploadImageToCloudinary(
              locaFileName,
              locaFilePath
            );
            if (resultImage) {
              tempOptions.push(resultImage.url);
            }
          }
        }
      } else if (req.body.options_type === "text") {
        if (req.body.text_options) {
          req.body.text_options.forEach((op) => {
            tempOptions.push(op);
          });
        }
      }
    }

    // all options in tempOptions

    if (req.body.question && Array.isArray(req.body.question)) {
      let tempOptStartInd = 0;
      let tempOptEndInd = 4;

      for (let i = 0; i < req.body.question.length; i++) {
        quizDocData.quizzes.push({
          question: "",
          answer: "",
          options_type: "",
          options: [],
        });
        quizDocData.quizzes[tempQuizLength].question = req.body.question[i];

        quizDocData.quizzes[tempQuizLength].options_type = req.body.options_type[i];
        // mcqDocData.quizzes[tempMcqLength].mark = req.body.mark[i];
        quizDocData.quizzes[tempQuizLength].explaination = req.body.explaination[i];

        if (quizDocData.quizzes[tempQuizLength].options_type === "text") {
          quizDocData.quizzes[tempQuizLength].answer = JSON.parse(req.body.answer_text)[i];
        }

        if (quizDocData.quizzes[tempQuizLength].options_type === "image") {
          var locaFilePath = ""
          var locaFileName = ""
          // console.log("132",req.files)
          if (i > req.files.answers.length - 1) {
            locaFilePath = req.files.answers[i - 1].path;
            locaFileName = req.files.answers[i - 1].filename;
          } else {
            locaFilePath = req.files.answers[i].path;
            locaFileName = req.files.answers[i].filename;
          }
          let imageExtensions = ["png", "jpg", "jpeg", "gif"];
          if (imageExtensions.includes(locaFileName.split(".")[1])) {
            var resultImage = await uploadImageToCloudinary(
              locaFileName,
              locaFilePath
            );
            if (resultImage) {
              quizDocData.quizzes[tempQuizLength].answer = resultImage.url;
            }
          }
        }
        for (let j = tempOptStartInd; j < tempOptEndInd; j++) {
          quizDocData.quizzes[tempQuizLength].options.push(tempOptions[j]);
        }
        tempOptStartInd = tempOptEndInd;
        tempOptEndInd = tempOptEndInd + 4;
        tempQuizLength++
      }

    } else if (req.body.question) {
      // console.log(":::",tempQuizLength)
      quizDocData.quizzes.push({
        question: "",
        answer: "",
        options_type: "",
        options: [],
      });
      quizDocData.quizzes[tempQuizLength].question = req.body.question;
      if (req.body.options_type === "text") {
        quizDocData.quizzes[tempQuizLength].answer = JSON.parse(req.body.answer_text)[0];;
      }

      if (req.body.options_type === "image") {
        var locaFilePath = req.files.answers[req.files.answers.length - 1].path;
        var locaFileName = req.files.answers[req.files.answers.length - 1].filename;
        let imageExtensions = ["png", "jpg", "jpeg", "gif"];
        let tempAnswer = [];
        if (imageExtensions.includes(locaFileName.split(".")[1])) {
          var resultImage = await uploadImageToCloudinary(
            locaFileName,
            locaFilePath
          );
          if (resultImage) {
            tempAnswer.push(resultImage.url);
          }
        }

        quizDocData.quizzes[tempQuizLength].answer = tempAnswer[0];
      }
      quizDocData.quizzes[tempQuizLength].options_type = req.body.options_type;
      // mcqDocData.quizzes[tempMcqLength].mark = req.body.mark;
      quizDocData.quizzes[tempQuizLength].explaination = req.body.explaination;
      // for (let j = 0; j < 4; j++) {
        
        quizDocData.quizzes[tempQuizLength].options=tempOptions;
      // }
    }

    // console.log("___",quizDocData)

    let addedQuizData = undefined

    if (req.body.options_type && req.body.question) {
      addedQuizData = await QuizModel.findOneAndUpdate(
        { _id: { $eq: req.body.quizDocId } },
        {
          ...quizDocData,
        },
        {
          new: true,
        }
      );
    }

    // console.log("LPP",isDataUpdated)
    // console.log("LPP2",addedMcqData)
    // console.log("LPP3",updatedPaperName)
    if(updatedPaperNameAndBanner&& !isDataUpdated && !addedQuizData){
      return res.status(200).send({success:"yes", updatedPaperNameAndBanner });
    }else if (addedQuizData && isDataUpdated) {
      return res.status(200).send({ success:"yes","addedData": addedQuizData, "isUpdated": isDataUpdated });
    } else if (addedQuizData && !isDataUpdated) {
      return res.status(200).send({success:"yes", addedQuizData });
    } else if (isDataUpdated && !addedQuizData) {
      return res.status(200).send({success:"yes", isDataUpdated });
    } else {
      throw new Error("quiz can't be updated");
    }

  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
}

exports.getQuizTemplates = async (req, res) => {
  try {
    const allQuizTemplates = await QuizModel.find({});

    if (allQuizTemplates) {
      return res.status(200).send({success:"yes",allQuizTemplates});
    }
    throw new Error("quiz templates not found");
  } catch (error) {
    res.status(400).send({ success:"no",message: error.message });
  }
};

exports.deleteQuizTemplates = async (req, res) => {
  try {
    const quizDocId = req.body.quizDocId;

    const deletedData = await QuizModel.findOneAndDelete(
      { _id: { $eq: quizDocId } }
    )

    if (deletedData) {
      return res.status(200).send({success:"yes", message: "quiz template deleted successfully" })
    } else {
      throw new Error("cannot delete quiz template")
    }

  } catch (error) {
    res.status(400).send({success:"no", message: error.message });
  }
}