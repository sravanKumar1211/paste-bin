import express from 'express';
import { createPaste, getPaste, viewPasteHTML } from '../controllers/pasteController.js';


const router = express.Router();


// 2. Create Paste - Matches the POST /api/pastes requirement
router.post('/pastes', createPaste);

// 3. Get Paste Metadata/JSON - Matches GET /api/pastes/:id
router.get('/pastes/:id', getPaste);
router.get('/p/:id', viewPasteHTML);


export default router;