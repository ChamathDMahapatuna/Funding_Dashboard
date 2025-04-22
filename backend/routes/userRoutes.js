import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new admin (admin only)
router.post('/register-admin', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Create new admin user
        const user = await User.create({
            email,
            password,
            role: "admin"
        });
        
        if (user) {
            res.status(201).json({
                message: "Admin user created successfully"
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Other existing routes...

export default router;
