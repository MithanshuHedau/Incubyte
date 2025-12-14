const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb = require("./connection/db");

const authRoutes = require("./routes/auth.routes");
const sweetsRoutes = require("./routes/sweets.routes");

const app = express();

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Add your deployed frontend URL in environment variable
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now, restrict in production
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
  console.log(`Website running on http://localhost:${PORT}`);
});
