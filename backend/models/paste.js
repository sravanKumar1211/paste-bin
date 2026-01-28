import mongoose from 'mongoose';

const pasteSchema = new mongoose.Schema({
    content: {
         type: String,
          required: true
         },
    ttl_seconds: { 
        type: Number,
         default: null
         },
    max_views: {
         type: Number,
          default: null 
        },
    current_views: {
         type: Number,
          default: 0 },
    createdAt: { 
        type: Date,
         default: Date.now 
        }
});

export default mongoose.model('Paste', pasteSchema);