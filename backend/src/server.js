import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';
import newsletterRoutes from './routes/newsletter.js';
import paymentRoutes from './routes/payment.js';
import orderRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PAYSTACK_SECRET_KEY',  // Using Paystack, not Stripe
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Please check your .env file against .env.example');
    process.exit(1);
}

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration - Enhanced for Vercel serverless
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173', // Always allow local dev
    'https://abella-stitches.vercel.app' // Production frontend
].filter((origin, index, self) => self.indexOf(origin) === index); // Remove duplicates

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // 24 hours
};

// Manual preflight handler - ensures OPTIONS requests always succeed on Vercel
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Abella Stitches API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server (only when not in Vercel serverless environment)
const PORT = process.env.PORT || 5000;

// Only start listening if not in production or not on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless functions
export default app;
