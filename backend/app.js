const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDb = require("./connection/db");

const authRoutes = require("./routes/auth.routes");
const sweetsRoutes = require("./routes/sweets.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop API is running");
});

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(`Website running on http://localhost:${process.env.PORT}`);
});
