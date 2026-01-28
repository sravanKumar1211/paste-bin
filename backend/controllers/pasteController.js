// import Paste from '../models/paste.js';
// import { asyncHandler } from '../utils/asyncHandler.js';

// // Helper to handle the "x-test-now-ms" header for automated testing
// const getNow = (req) => {
//     const testTime = req.headers['x-test-now-ms'];
//     return testTime ? new Date(parseInt(testTime)) : new Date();
// };

// export const createPaste = asyncHandler(async (req, res) => {
//     const { content, ttl_seconds, max_views } = req.body;
//     if (!content) return res.status(400).json({ error: "Content is required" });

//     const paste = await Paste.create({ content, ttl_seconds, max_views });
    
//     // Return the format expected by the assignment instructions
//     res.status(201).json({
//         id: paste._id,
//         url: `${req.protocol}://${req.get('host')}/p/${paste._id}`
//     });
// });

// export const getPaste = asyncHandler(async (req, res) => {
//     const paste = await Paste.findById(req.params.id);
//     const now = getNow(req);

//     if (!paste) return res.status(404).json({ error: "Paste not found" });

//     // logic for TTL expiry
//     if (paste.ttl_seconds) {
//         const expiryDate = new Date(paste.createdAt.getTime() + paste.ttl_seconds * 1000);
//         if (now > expiryDate) {
//             await Paste.findByIdAndDelete(paste._id);
//             return res.status(404).json({ error: "Paste expired" });
//         }
//     }

//     // logic for Max Views
//     if (paste.max_views && paste.current_views >= paste.max_views) {
//         await Paste.findByIdAndDelete(paste._id);
//         return res.status(404).json({ error: "View limit reached" });
//     }

//     // Increment view count
//     paste.current_views += 1;
//     await paste.save();

//     res.status(200).json(paste);
// });








import Paste from '../models/paste.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to determine the "current" time.
 * If TEST_MODE is enabled and the specific header is provided, 
 * use the header's time for deterministic testing[cite: 133, 134, 135].
 */
const getNow = (req) => {
    const testTime = req.headers['x-test-now-ms'];
    if (process.env.TEST_MODE === "1" && testTime) {
        return new Date(parseInt(testTime));
    }
    return new Date(); // Use real system time otherwise [cite: 136]
};

export const createPaste = asyncHandler(async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    // Requirement: content must be a non-empty string [cite: 98]
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: "Content is required and must be a string" });
    }

    // Requirement: ttl_seconds and max_views must be integers >= 1 if present 
    if (ttl_seconds && (parseInt(ttl_seconds) < 1)) return res.status(400).json({ error: "ttl_seconds must be >= 1" });
    if (max_views && (parseInt(max_views) < 1)) return res.status(400).json({ error: "max_views must be >= 1" });

    const paste = await Paste.create({ 
        content, 
        ttl_seconds: ttl_seconds ? parseInt(ttl_seconds) : undefined, 
        max_views: max_views ? parseInt(max_views) : undefined 
    });
    
    // Response must return 'id' and 'url' [cite: 104, 105]
    // The URL must point to /p/:id on your domain [cite: 148]
    res.status(201).json({
        id: paste._id,
        url: `${req.protocol}://${req.get('host')}/p/${paste._id}`
    });
});

export const getPaste = asyncHandler(async (req, res) => {
    const paste = await Paste.findById(req.params.id);
    const now = getNow(req); // Use the helper to support Test Mode

    // If paste doesn't exist in DB, return 404 [cite: 121, 125]
    if (!paste) return res.status(404).json({ error: "Paste not found" });

    // 1. Logic for TTL expiry [cite: 75]
    if (paste.ttl_seconds) {
        const expiryDate = new Date(paste.createdAt.getTime() + paste.ttl_seconds * 1000);
        if (now > expiryDate) {
            await Paste.findByIdAndDelete(paste._id);
            return res.status(404).json({ error: "Paste expired" }); // Must return 404 [cite: 122, 125]
        }
    }

    // 2. Logic for Max Views [cite: 76]
    // If the limit is reached, it should have been deleted or return 404
    if (paste.max_views && paste.current_views >= paste.max_views) {
        await Paste.findByIdAndDelete(paste._id);
        return res.status(404).json({ error: "View limit exceeded" }); // Must return 404 [cite: 123, 125]
    }

    // 3. Increment view count BEFORE returning data
    // Each successful API fetch counts as a view 
    paste.current_views += 1;
    await paste.save();

    // 4. Calculate final values for the specific JSON response required [cite: 111]
    const remainingViews = paste.max_views ? (paste.max_views - paste.current_views) : null;
    const expiresAt = paste.ttl_seconds 
        ? new Date(paste.createdAt.getTime() + paste.ttl_seconds * 1000).toISOString() 
        : null;

    // Requirement: Response must contain content, remaining_views, and expires_at [cite: 112, 113, 114]
    res.status(200).json({
        content: paste.content,
        remaining_views: remainingViews, // null if unlimited [cite: 117]
        expires_at: expiresAt // null if no TTL [cite: 118]
    });
});