
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



export const viewPasteHTML = asyncHandler(async (req, res) => {
    const paste = await Paste.findById(req.params.id);
    const now = getNow(req);

    if (!paste) {
        return res.status(404).send("Paste not found");
    }

    // TTL check
    if (paste.ttl_seconds) {
        const expiryDate = new Date(paste.createdAt.getTime() + paste.ttl_seconds * 1000);
        if (now > expiryDate) {
            await Paste.findByIdAndDelete(paste._id);
            return res.status(404).send("Paste expired");
        }
    }

    // Max views check
    if (paste.max_views && paste.current_views >= paste.max_views) {
        await Paste.findByIdAndDelete(paste._id);
        return res.status(404).send("View limit exceeded");
    }

    // Increment views
    paste.current_views += 1;
    await paste.save();

    // Escape HTML to prevent script execution
    const safeContent = paste.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Send HTML
    res.status(200).send(`
       <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Paste</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #000;
      font-family: system-ui, monospace;
      color: white;
    }

    .container {
      max-width: 900px;
      margin: 80px auto;
      padding: 20px;
    }

    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,.6);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #64748b;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .highlight {
      color: #60a5fa;
      margin-left: 4px;
    }

    pre {
      background: rgba(0,0,0,.3);
      padding: 16px;
      border-radius: 10px;
      color: #bfdbfe;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
      border: 1px solid rgba(255,255,255,0.05);
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="card">

      <div class="meta">
        <div>
          Views Remaining:
          <span class="highlight">
            ${paste.max_views ? paste.max_views - paste.current_views : "Unlimited"}
          </span>
        </div>

        <div>
          Expires:
          <span class="highlight">
            ${
              paste.ttl_seconds
                ? new Date(paste.createdAt.getTime() + paste.ttl_seconds * 1000).toLocaleString()
                : "Never"
            }
          </span>
        </div>
      </div>

      <pre>${safeContent}</pre>

    </div>
  </div>

</body>
</html>
    `);
});
