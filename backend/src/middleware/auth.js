import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get admin user from token
        req.admin = await AdminUser.findById(decoded.id).select('-passwordHash');

        if (!req.admin) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export { protect };
