// routes/candidates.js
import express from "express";
import { getCandidates, addCandidate, deleteCandidate } from "../controllers/candidatesController.js";
import { verifyAdmin } from "../middleware/auth.js"; // 🔐 Import admin check
const router = express.Router();

router.get("/", getCandidates);                 // 🔓 Public access
router.post("/", verifyAdmin, addCandidate);    // 🔒 Requires admin
router.delete("/:id", verifyAdmin, deleteCandidate); // 🔒 Requires admin

export default router;