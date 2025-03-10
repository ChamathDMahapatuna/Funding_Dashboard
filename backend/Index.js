import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import fundingRoutes from "./routes/fundingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins (for development only)
  }));
app.use(morgan("dev")); // Logging requests

// Database Connection
connectDB();

// Routes
app.use("/api/fundings", fundingRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful Shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB Disconnected");
    process.exit(0);
});
