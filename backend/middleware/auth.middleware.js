const jwt = require("jsonwebtoken");
const User = require("../model/User.model");

const jwtSecret = process.env.JWT_SECRET;

async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ message: "No token , cannot access this url endpoint" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token user Bro , Must Ensure a correct token" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "You are Unauthorized Bro , Keep yourself as authorised", error: err.message });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "What the Hell , Unauthorized Bro " });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only Can access this functionality" });
  next();
}

module.exports = { authenticate, requireAdmin };
