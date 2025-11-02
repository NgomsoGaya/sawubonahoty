import pool from "../db/pool.js";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, is_admin FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
