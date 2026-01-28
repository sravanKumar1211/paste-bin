// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv'; // Corrected import
// import cors from 'cors';
// import pasteRoutes from './routes/pasteRoutes.js';

// // Load environment variables from .env file
// dotenv.config();

// const app = express();

// // Standard Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// // Assignment Requirement: GET /api/healthz, POST /api/pastes, GET /api/pastes/:id
// app.use('/', pasteRoutes); 

// // Global Error Handler
// // Assignment Requirement: Invalid inputs must return a 4xx status with a JSON error body [cite: 53]
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//         error: err.message || "Internal Server Error"
//     });
// });

// const PORT = process.env.PORT || 8000;
// const MONGO_URI = process.env.MONGODB_URI;

// if (!MONGO_URI) {
//     console.error("MONGODB_URI is missing in .env file");
//     process.exit(1);
// }

// // Connect to MongoDB Atlas (Persistence Layer) 
// mongoose.connect(MONGO_URI)
//     .then(() => {
//         console.log("Connected to MongoDB Atlas");
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch(err => {
//         console.error("Database connection failed:", err);
//     });




//     app.use(
//   express.static(path.join(__dirname, '../frontend/paste-bin'))
// );

// app.use(/.*/, (_, res) => {
//   res.sendFile(
//     path.resolve(__dirname, '../frontend/paste-bin/index.html')
//   );
// });








import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Missing import fixed
import { fileURLToPath } from 'url'; // Required for ES Modules __dirname
import pasteRoutes from './routes/pasteRoutes.js';

dotenv.config();

const app = express();

// ES Module __dirname Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Middleware
app.use(cors());
app.use(express.json());

/**
 * Health Check: GET /api/healthz
 * Requirement: Must return HTTP 200, JSON, and reflect persistence access [cite: 81, 82, 83, 85]
 */


// API Routes
app.use('/', pasteRoutes); 

/**
 * Static File Serving
 * Serving the React frontend from the backend to maintain a single domain [cite: 105, 148]
 */
const frontendPath = path.join(__dirname, '../frontend/paste-bin/dist'); // Adjust 'dist' to your build folder name
app.use(express.static(frontendPath));

// Catch-all for React Router: Redirects all non-API requests to index.html [cite: 128]
app.get('*', (req, res) => {
    // Ensure we don't accidentally catch API routes here
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.resolve(frontendPath, 'index.html'));
});

// Global Error Handler
// Requirement: Invalid inputs must return a 4xx status with a JSON body [cite: 107]
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("MONGODB_URI is missing in .env file");
    process.exit(1);
}

// Connect to MongoDB Atlas (Persistence Layer) [cite: 140]
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        // Start server only after DB is connected to ensure healthz is accurate
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

export default app; // Useful for Vercel