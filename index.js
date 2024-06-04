const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const mcqRoutes=require("./routes/mcqRoutes")
const quizRoutes=require("./routes/quizRoutes")
const invoiceRoutes=require("./routes/invoiceRoutes")
const userRoutes=require("./routes/userRoutes")
const purchaseOrderRoutes=require("./routes/purchaseOrderRoutes")
const faqRoutes=require("./routes/faqRoutes")
const galleryRoutes=require("./routes/galleryRoutes")
const categoryRoutes=require("./routes/categoryRoutes")
const productRoutes=require("./routes/productRoutes")
const  trainingModuleRoutes=require("./routes/trainingModuleRoutes")
const  cusRoutes=require("./routes/chooseUsRoutes")
const testimonialRoutes=require("./routes/testimonialRoutes")
const serviceRoutes=require("./routes/serviceRoutes")
const partnerRoutes=require("./routes/partnerRoutes")
const ourMissionRoutes=require("./routes/ourMission")
const ourVisionRoutes=require("./routes/ourVision")
const aboutUsRoutes=require("./routes/aboutUsRoutes")
const callUsRoutes=require("./routes/callUsRoutes")
const emailUsRoutes=require("./routes/emailUsRoutes")

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;


app.use("/api/template", fileRoutes);
app.use("/api/mcq-template", mcqRoutes);
app.use("/api/quiz-template", quizRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/purchase-order", purchaseOrderRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/training-module", trainingModuleRoutes);
app.use("/api/choose-us", cusRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/service",serviceRoutes);
app.use("/api/partner",partnerRoutes);
app.use("/api/our-mission",ourMissionRoutes);
app.use("/api/our-vision",ourVisionRoutes);
app.use("/api/about-us",aboutUsRoutes);
app.use("/api/call-us",callUsRoutes);
app.use("/api/email-us",emailUsRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
