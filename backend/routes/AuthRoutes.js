import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const user = new User({ email, password, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received login request:", { email, password });

         console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,  // Use process.env.JWT_SECRET directly here
            { expiresIn: "1h" }
        );
        
        console.log("Generated Token:", token);
        res.json({ token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export default router;
