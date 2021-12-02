// Imports for server and database:
const express = require("express");
const router = express.Router(); // Now instead of express becoming "app" here the router takes its place
const formidable = require("express-formidable");
router.use(formidable());

// Import Model
const User = require("../models/User");

// Imports for authentication:
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const { find } = require("../models/User");

// Signup //
router.post("/users/user-signup", async (req, res) => {
  const { email, username, phone, password } = req.fields;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json("An account with this email already exists");
    } else {
      if (email && username && password) {
        //encrypt
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);
        //create
        const user = new User({
          email: email,
          account: { username: username, phone: phone },
          // avatar: req.fields., // nous verrons plus tard comment uploader une image
          token: token,
          hash: hash,
          salt: salt,
        });
        // Save
        await user.save();
        res.json([
          {
            message: `A new user has been created with <br/> ID: ${user._id}, <br/>  Token: ${user.token}, <br/> Account: ${user.account}`,
          },
        ]);
      }
    }
  } catch (error) {
    res.status(400).json("email, username, and password are needed to sign-up");
  }
});

// Login //
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    // identify if email already exists
    const user = await User.findOne({ email: email });

    // if it does, there is an account, authenticate password ...
    if (user) {
      const verify = SHA256(password + user.salt).toString(encBase64);
      if (verify === user.hash) {
        res
          .status(200)
          .json({ _id: user._id, token: user.token, account: user.account });
      } else {
        res.status(401).json("email/password combination is incorrect");
      }
    }

    // else there is no email associated with an account in DB
    else {
      res.status(401).json("There isn't an account with this email");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

// List all users //
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("account");
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const authoriseFirst = require("../middleware/authoriseFirst");

// Authorise specific user and show their info. //
router.get("/users/user/:_id", authoriseFirst, async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      res.json({
        username: user.account.username,
        email: user.email,
        phone: user.account.phone,
        avatar: user.account.avatar,
      });
    }
  } catch (error) {
    return res.json("user not found");
  }
});

// Authorise specific user to delete their info. //
router.post("/users/delete-user", async (req, res) => {
  try {
    const user = User.findOne({ email: req.fields.email });
    if (user) {
      await user.deleteOne();
      res.json({ message: "Your profile was removed" });
    } else {
      res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//// EXPORT THESE ROUTES ////
module.exports = router; // allows us to use these routes in index.js
