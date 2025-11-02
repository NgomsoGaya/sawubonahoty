import express from "express";
import { getUsers } from "../controllers/usersController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getUsers); // Admin only

export default router;
