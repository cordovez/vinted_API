const User = require("../models/User");

const authoriseFirst = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({
      token: token,
    }).select("account _id");
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
