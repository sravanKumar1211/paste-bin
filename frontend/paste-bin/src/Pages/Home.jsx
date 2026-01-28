import React, { useState } from 'react';
import axios from 'axios'; // Import axios library

const Home = () => {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleCreate = async () => {
    // Basic validation: Don't send empty pastes
    if (!content) return alert("Please enter text");
    
    try {
      // Axios POST request
      // Note: Axios automatically stringifies the object to JSON
      const response = await axios.post('http://localhost:8000/api/pastes', {
        content,
        ttl_seconds: ttl ? parseInt(ttl) : undefined,
        max_views: maxViews ? parseInt(maxViews) : undefined
      });

      // Axios puts the response body inside the 'data' property
      const data = response.data;

      /* SHARE LINK LOGIC:
         We use window.location.origin to get the current domain (e.g., http://localhost:5173).
         We append '/p/' because that is the path defined in your App.js Routes 
         for the ViewPaste component.
      */
      if (data.id) {
        const frontendLink = `${window.location.origin}/api/pastes/${data.id}`;
        setShareLink(frontendLink);
      }
    } catch (error) {
      // Axios error handling is more robust than fetch
      console.error("Error creating paste:", error);
      alert(error.response?.data?.error || "Failed to create paste. Is the backend running?");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-700">
      <h1 className="text-white text-3xl font-bold mb-6">Create New Paste</h1>
      
      {/* Input area for paste content */}
      <textarea 
        className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none mb-4"
        placeholder="Enter your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Inputs for optional constraints */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input 
          type="number" 
          placeholder="Expiry (Seconds)" 
          className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white" 
          value={ttl}
          onChange={(e) => setTtl(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Max Views" 
          className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-white" 
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)} 
        />
      </div>

      <button 
        onClick={handleCreate} 
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
      >
        Create Paste Link
      </button>

      {/* Conditionally render the share link if it exists */}
      {shareLink && (
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/40 rounded-lg flex justify-between items-center animate-in slide-in-from-bottom-2">
          <span className="text-blue-300 truncate mr-4">{shareLink}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              alert("Link copied to clipboard!");
            }} 
            className="bg-blue-600 px-4 py-2 rounded text-sm text-white hover:bg-blue-500 whitespace-nowrap"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;