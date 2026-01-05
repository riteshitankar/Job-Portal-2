import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      dbName: "job_portal",              // optional but recommended
      serverSelectionTimeoutMS: 5000,  // 🔑 prevents buffering timeout
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);

    // 🔴 Stop server if DB fails
    process.exit(1);
  }
};

export default connectDB;