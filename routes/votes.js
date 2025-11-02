// routes/votes.js
import express from "express";
import { castVote, getResults } from "../controllers/votesController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, castVote);      // 🔒 Requires logged-in user
router.get("/results", getResults);         // 🔓 Public access

export default router;