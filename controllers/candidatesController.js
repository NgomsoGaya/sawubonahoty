// controllers/candidatesController.js
import pool from "../db/pool.js";

// ✅ Get all candidates (Public)
export const getCandidates = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM candidates ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching candidates" });
  }
};

// ➕ Add a candidate (Requires Admin: verifyAdmin)
export const addCandidate = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Candidate name required" });

  try {
    const result = await pool.query(
      "INSERT INTO candidates (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json({ message: "Candidate added", candidate: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding candidate" });
  }
};

// ➖ Delete a candidate (Requires Admin: verifyAdmin)
export const deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    // RETURNING * lets us confirm what was deleted
    const result = await pool.query("DELETE FROM candidates WHERE id = $1 RETURNING *", [id]); 
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json({ message: "Candidate deleted", candidate: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting candidate" });
  }
};