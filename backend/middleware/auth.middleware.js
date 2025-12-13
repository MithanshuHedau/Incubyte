const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

const jwtSecret = process.env.JWT_SECRET || "secretkey";

async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}

module.exports = { authenticate, requireAdmin };
