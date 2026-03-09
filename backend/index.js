import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

// Route Imports
import onboardingRoutes from './src/routes/onboardingRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins (all vite dev ports + production)
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean);

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl) or from allowed origins
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Cross-Origin headers — use 'unsafe-none' so Google OAuth
// popup/redirect flows and postMessage are NOT blocked in development.
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Log connection attempts (but hide password for security)
const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':****@');

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Show error after 5s instead of 30s
})
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        if (err.message.includes('IP not whitelisted')) {
            console.error('👉 TIP: Go to MongoDB Atlas > Network Access and add your current IP address.');
        }
    });

// Debugging connection state
mongoose.connection.on('error', err => {
    console.error('Mongoose Error:', err);
});

// Register Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Vithartha Consulting Backend API is Running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
export default app;

