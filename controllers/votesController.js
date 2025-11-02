// controllers/votesController.js
import pool from "../db/pool.js";

// ✅ Cast a vote (Requires Authentication: verifyToken)
export const castVote = async (req, res) => {
  // Use the user ID extracted from the verified JWT token
  const user_id = req.user.id; 
  const { candidate_id } = req.body;

  if (!user_id || !candidate_id) {
    return res.status(400).json({ error: "Missing user ID or candidate ID" });
  }

  try {
    await pool.query(
      "INSERT INTO votes (user_id, candidate_id) VALUES ($1, $2)",
      [user_id, candidate_id]
    );
    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    // 23505 is PostgreSQL unique violation error (for UNIQUE(user_id) constraint)
    if (err.code === "23505") { 
      res.status(400).json({ error: "User has already voted" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Failed to cast vote" });
    }
  }
};

// ✅ Get results (Public)
export const getResults = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        COUNT(v.id) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name
      ORDER BY vote_count DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching results" });
  }
};