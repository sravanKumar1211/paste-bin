import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewPaste = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const startTimer = (expiresAt) => {
    if (!expiresAt) return;

    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  };

  useEffect(() => {
    const loadPaste = async () => {
      try {
        const res = await axios.get(`/api/pastes/${id}`);
        setPaste(res.data);

        if (res.data.expires_at) {
          startTimer(res.data.expires_at);
        }
      } catch {
        setError(true);
      }
    };

    loadPaste();
  }, [id]);

  if (error) {
    return <div className="text-center mt-20 text-red-500 font-bold">404 - Paste not found</div>;
  }

  if (!paste) {
    return <div className="text-center mt-20 text-blue-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <div className="flex justify-between text-xs text-slate-500 mb-4">
          <span>
            Views Remaining: 
            <span className="text-blue-400 ml-1">
              {paste.remaining_views ?? "Unlimited"}
            </span>
          </span>

          <span>
            Time Left: 
            <span className="text-blue-400 ml-1">
              {paste.expires_at ? timeLeft : "Permanent"}
            </span>
          </span>
        </div>

        <pre className="text-blue-100 whitespace-pre-wrap bg-black/30 p-4 rounded-lg">
          {paste.content}
        </pre>

      </div>
    </div>
  );
};

export default ViewPaste;
