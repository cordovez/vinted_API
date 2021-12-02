const User = require("../models/User");

const authoriseFirst = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (!user) {
      return res.status(401).json({ error: "unauthorised" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorised" });
  }
};
module.exports = authoriseFirst;
