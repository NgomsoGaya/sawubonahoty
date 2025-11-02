import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Import route files
import candidatesRoutes from "./routes/candidates.js";
import usersRoutes from "./routes/users.js";
import votesRoutes from "./routes/votes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidatesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/vote", votesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));