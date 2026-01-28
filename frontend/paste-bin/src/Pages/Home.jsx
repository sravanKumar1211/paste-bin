
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleCreate = async () => {
    if (!content.trim()) {
      alert("Please enter text");
      return;
    }

    try {
      const response = await axios.post('/api/pastes', {
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined
      });

      if (response.data?.id) {
        setShareLink(`${window.location.origin}/p/${response.data.id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create paste");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-6">Create New Paste</h1>

      <textarea
        className="w-full h-64 bg-slate-900 border border-slate-800 rounded-xl p-4 text-white mb-4"
        placeholder="Enter your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

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
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
      >
        Create Paste Link
      </button>

      {shareLink && (
        <div className="mt-6 bg-blue-900/20 border border-blue-500/40 p-4 rounded-lg flex justify-between items-center">
          <span className="text-blue-300 truncate mr-3">{shareLink}</span>
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
