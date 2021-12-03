const mongoose = require("mongoose");
const User = require("../models/User");

const Offer = mongoose.model("Offer", {
  productName: { type: String, maxLength: 50 },
  productDescription: { type: String, maxLength: 500 },
  productPrice: { type: String, max: 100000 },
  productDetails: Array,
  productImage: { type: mongoose.Schema.Types.Mixed, default: {} },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = Offer;
