import express from 'express';
import { createPaste, getPaste } from '../controllers/pasteController.js';

const router = express.Router();

// 1. Health Check - Required by assignment to verify DB connection

router.get('/api/healthz', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({ ok: isConnected }); // [cite: 88]
});

// 2. Create Paste - Matches the POST /api/pastes requirement
router.post('/api/pastes', createPaste);

// 3. Get Paste Metadata/JSON - Matches GET /api/pastes/:id
router.get('/api/pastes/:id', getPaste);

export default router;