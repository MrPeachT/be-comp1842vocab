const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";
const COOKIE_NAME = "token";

async function getUserFromRequest(req) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
  } catch {
    return null;
  }
}

exports.authOptional = async (req, res, next) => {
  req.user = await getUserFromRequest(req);
  next();
};

exports.authRequired = async (req, res, next) => {
  req.user = await getUserFromRequest(req);

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  next();
};

exports.requireRole = role => async (req, res, next) => {
  req.user = await getUserFromRequest(req);

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ error: "Forbidden: insufficient role" });
  }

  next();
};

exports.COOKIE_NAME = COOKIE_NAME;
exports.JWT_SECRET = JWT_SECRET;