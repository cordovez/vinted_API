// Foundation: Imports for server and database:
const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
router.use(formidable());

// Functionality: Middleware & Cloudinary
const authoriseFirst = require("../middleware/authoriseFirst");
const cloudinary = require("cloudinary").v2;

// Foundation: Import Models
const Offer = require("../models/Offer");
const User = require("../models/User");
/////////////////
//// Routes ////
/////////////////

// Create new offer
router.post("/offer/publish", authoriseFirst, async (req, res) => {
  try {
    const newOffer = new Offer({
      productName: req.fields.title,
      productDescription: req.fields.description,
      productPrice: req.fields.price,
      productDetails: [
        { condition: req.fields.condition },
        { city: req.fields.city },
        { brand: req.fields.brand },
        { size: req.fields.size },
        { color: req.fields.color },
      ],
      owner: req.user,
    });
    // Upload photo from the client
    const clientUpload = await cloudinary.uploader.upload(
      req.files.picture.path,
      {
        // notice the file goes into a folder named after offer _id
        folder: `Vinted_API/offers/${newOffer._id}`,
      }
    );
    //the 'productImage' field from the model can now be assigned to the newOffer
    newOffer.productImage = clientUpload;

    await newOffer.save();
    return res.json(newOffer);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Read all offers
router.get("/offer/offers", authoriseFirst, async (req, res) => {
  try {
    const offers = await Offer.find().select(
      "productName productDescription productPrice productDetails condition city brand size color"
    );

    return res.json(offers);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// Update offer
router.post("/offer/update/:_id", authoriseFirst, async (req, res) => {
  try {
    // what offer?
    const offer = await Offer.findById(req.params._id).select(
      "productName productDescription productPrice productDetails condition city brand size color"
    );
    // which params are we updating?

    if (req.query.title) {
      offer.productName = req.query.title;
    }
    if (req.query.description) {
      offer.productDescription = req.query.description;
    }
    if (req.query.price) {
      offer.productPrice = req.query.price;
    }
    if (req.query.condition) {
      offer.condition = req.query.condition;
    }
    if (req.query.city) {
      offer.city = req.query.city;
    }
    if (req.query.brand) {
      offer.brand = req.query.brand;
    }
    if (req.query.size) {
      offer.size = req.query.size;
    }
    if (req.query.color) {
      offer.color = req.query.color;
    } else {
    }
    // save offer
    await offer.save();
    return res.json(offer);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

// Delete offer
router.post("/offer/delete/:_id", authoriseFirst, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params._id);
    return res.status(200).json("The offer has been deleted");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// TO DO: 'delete offer' should also delete photos and folder from Cloudinary

//// EXPORT THESE ROUTES ////
module.exports = router; // allows us to use these routes in index.js
