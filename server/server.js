// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";
//  import aiRoutes from "./routes/aiRoutes.js";
//  import noteRoutes from "./routes/noteRoutes.js";

// app.use("/api/notes", noteRoutes);

// if (!process.env.JWT_SECRET) {
//   console.error("JWT_SECRET is required in environment variables.");
//   process.exit(1);
// }

// const app = express();
// const PORT = process.env.PORT || 5000;

// const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
// const allowedOrigins = process.env.CLIENT_URL
//   ? [...defaultOrigins, ...process.env.CLIENT_URL.split(",").map((o) => o.trim())]
//   : defaultOrigins;

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(null, false);
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());

// app.get("/api/health", (_req, res) => {
//   res.json({ ok: true, service: "SmartTask Pro API" });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/notes", noteRoutes);
// app.use((_req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use((err, _req, res, _next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ message: "Internal server error" });
// });

// await connectDB();

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

// --- ROUTES ---
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";


const app = express();
const PORT = process.env.PORT || 5001;

// --- CORS ---
const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = process.env.CLIENT_URL
  ? [...defaultOrigins, ...process.env.CLIENT_URL.split(",").map((o) => o.trim())]
  : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// --- MIDDLEWARE ---
app.use(express.json());

// --- HEALTH CHECK ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "SmartTask Pro API" });
});

// --- MOUNT ROUTES ---
// --- MOUNT ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ YOU NEED TO ADD THIS LINE RIGHT HERE:
app.use("/api/documents", documentRoutes);

// --- ERROR HANDLING ---
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// --- START SERVER ---
await connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});