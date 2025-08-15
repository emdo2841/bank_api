const jwt = require("jsonwebtoken");

const Account = require("../models/account");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Add this log to see the decoded payload
    req.account = await Account.findById(decoded.id).select("-password");
    console.log("User from DB:", req.user); // Log the user fetched from DB
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.account.role)) {
      return res.status(403).json({ message: "Not authorized for this role" });
    }
    next();
  };
};
