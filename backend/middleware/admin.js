const User = require("../models/user");

module.exports = async function (req, res, next) {
  if (!req.user)
    return res.status(401).json({ message: "Not authenticated" });

  const user = await User.findById(req.user.id);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};
