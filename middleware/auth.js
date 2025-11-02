import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🧩 Verify user token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // add user info (id, is_admin) to request object
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// 🔐 Verify admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  });
};