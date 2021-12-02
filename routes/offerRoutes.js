// Imports for server and database:
const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const authoriseFirst = require("../middleware/authoriseFirst");
router.use(formidable());

// Import Model
const Offer = require("../models/Offer");

// publish new offer ////authoriseFirst,
router.post("/offer/publish", async (req, res) => {
  try {
    /*   here I am deconstructing the queries passed:
    product_name, product_description, product_price, product_details, product_image,owner,
    */
    const newOffer = new Offer({
      product: req.fields.title,
      //   description: req.fields.description,
      //   price: req.fields.price,
      //   condition: req.fields.condition,
      //   city: req.fields.city,
      brand: req.fields.brand,
      //   size: req.fields.size,
      //   color: req.fields.color,
      //   image: req.files.image,
      //   owner: req.fields.owner,
    });
    await newOffer.save();
    return res.json(newOffer);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//// EXPORT THESE ROUTES ////
module.exports = router; // allows us to use these routes in index.js
