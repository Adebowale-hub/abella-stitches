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

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173' // Always allow local dev
].filter((origin, index, self) => self.indexOf(origin) === index); // Remove duplicates

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
