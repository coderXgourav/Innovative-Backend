const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    paper_name: {
      type: String,
    },
    banner: {
      type: String,
    },
    quizzes: [{
      question: {
        type: String,
      },
      options_type: {
        type: String
      },
      // mark:{
      //   type:Number
      // },
      explaination:{
        type: String
      },
      options: [{
        type: String,
      }],
      answer: {
        type: String
      }
    }]
  },
  { timestamps: true }
);

const QuizModel = mongoose.model("QuizModel", quizSchema);

module.exports = QuizModel;
