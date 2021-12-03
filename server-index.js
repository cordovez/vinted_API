// import secret keys
require("dotenv").config();

// Basic dependencie
const express = require("express");
const formidable = require("express-formidable");
const app = express();
app.use(formidable());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

// import cloudinary
const cloudinary = require("cloudinary").v2;

// cloudinary configuration access keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/userRoutes");
const offerRoutes = require("./routes/offerRoutes");

app.use(userRoutes, offerRoutes);
app.all("*", (req, res) => {
  res.status(404).json("That page does not exist");
});
app.listen(process.env.PORT, () => {
  console.log("Server is up and running 🏃🏻‍♂️💨");
});
