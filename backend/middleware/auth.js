const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const header = req.header("Authorization");

    if (!header)
      return res.status(401).json({ message: "No token, access denied" });

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   // 🔥 THIS IS IMPORTANT

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
