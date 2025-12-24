import express from 'express';
import AdminUser from '../models/AdminUser.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/register
// @desc    Register a new admin user (for initial setup)
// @access  Public (can be disabled after initial setup)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin already exists
        const adminExists = await AdminUser.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        // Create admin user
        const admin = await AdminUser.create({
            name,
            email,
            passwordHash: password // Will be hashed by pre-save hook
        });

        // Generate token
        const token = admin.generateToken();

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/login
// @desc    Authenticate admin user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const admin = await AdminUser.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = admin.generateToken();

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/admin/logout
// @desc    Logout admin user
// @access  Public
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
});

// @route   GET /api/admin/me
// @desc    Get current admin user
// @access  Private
router.get('/me', protect, (req, res) => {
    res.json(req.admin);
});

export default router;
