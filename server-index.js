const express = require("express");
const formidable = require("express-formidable");
const app = express();
app.use(formidable());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/vinted");

const userRoutes = require("./routes/userRoutes");
const offerRoutes = require("./routes/offerRoutes");

app.use(userRoutes, offerRoutes);
app.all("*", (req, res) => {
  res.status(404).json("That page does not exist");
});
app.listen(3000, () => {
  console.log("Server is up and running 🏃🏻‍♂️💨");
});
