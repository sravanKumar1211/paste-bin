import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pasteRoutes from './routes/pasteRoutes.js';

dotenv.config();

const app = express();

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Health Check: GET /api/healthz
 * Requirement: Must return HTTP 200 and reflect DB connection status
 */
app.get('/api/healthz', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 500).json({ ok: isConnected });
});

// API Routes
app.use('/api', pasteRoutes);
app.use('/', pasteRoutes);

/**
 * Static File Serving
 * Points to your frontend build folder
 */
const frontendPath = path.join(__dirname, '../frontend/paste-bin/dist');
app.use(express.static(frontendPath));

// Catch-all route for React Router

app.use((req, res, next) => {

    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: "API endpoint not found" });
    }

    const indexPath = path.resolve(frontendPath, 'index.html');

    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("Frontend build missing at:", indexPath);
            res.status(500).json({ 
                error: "Frontend build files not found.",
                instruction: "Run 'npm run build' in frontend folder"
            });
        }
    });
});


// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("CRITICAL: MONGODB_URI is missing in .env");
    process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        // Only start listening if we aren't on Vercel (Vercel handles listening itself)
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

export default app;