const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB Badhiaa se !");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
module.exports = connectDb;
