// controllers/authController.js
import pool from "../db/pool.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Use a fallback for local development if .env isn't loaded
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; 

// 🧾 Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password required" });
  }

  try {
    // Hash the password before storing it
    const hashed = await bcrypt.hash(password, 10); 
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, is_admin",
      [name, email, hashed]
    );
    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (err) {
    // 23505 is PostgreSQL unique violation error (for duplicate email)
    if (err.code === "23505") { 
        res.status(400).json({ error: "Email already exists" });
    } else {
        console.error(err);
        res.status(500).json({ error: "Error registering user" });
    }
  }
};

// 🔑 Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    // Compare the submitted password with the stored hash
    const valid = await bcrypt.compare(password, user.password); 
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create the token, including user ID and admin status in the payload
    const token = jwt.sign( 
      { id: user.id, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};