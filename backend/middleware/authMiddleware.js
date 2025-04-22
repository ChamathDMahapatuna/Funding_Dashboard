import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Authenticate user middleware
export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin middleware - checks if user is an admin
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};
