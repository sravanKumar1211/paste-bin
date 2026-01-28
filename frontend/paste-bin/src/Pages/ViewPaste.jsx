// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios'; // Import Axios for cleaner API requests

// const ViewPaste = () => {
//   const { id } = useParams(); // Extract the unique ID from the URL (/p/:id)
//   const [paste, setPaste] = useState(null); // Store paste data (content, views, etc.)
//   const [error, setError] = useState(false); // Track if the paste is 404 or expired
//   const [timeLeft, setTimeLeft] = useState(''); // Live countdown string

//   /**
//    * Helper function to calculate time remaining.
//    * Defined outside useEffect but inside the component.
//    */
//   const updateTimer = (expiry) => {
//     if (!expiry) return;
//     const diff = new Date(expiry) - new Date(); // Calculate difference in milliseconds
    
//     // If the current time has passed the expiry time
//     if (diff <= 0) {
//       setTimeLeft('Expired');
//       return;
//     }

//     // Convert milliseconds into hours, minutes, and seconds
//     const h = Math.floor((diff / (1000 * 60 * 60))); 
//     const m = Math.floor((diff / 1000 / 60) % 60);
//     const s = Math.floor((diff / 1000) % 60);
//     setTimeLeft(`${h}h ${m}m ${s}s`);
//   };

//   useEffect(() => {
//     /**
//      * Fetching data using Axios.
//      * Axios automatically parses JSON, so we don't need .json()
//      */
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/api/pastes/${id}`);
//         const data = response.data;
//         console.log(data)
//         setPaste(data);
        
//         // If the backend returned an expiry date, initialize the countdown
//         if (data && data.expires_at) {
//           updateTimer(data.expires_at);
//           // Set an interval to update the clock every second
//           const interval = setInterval(() => updateTimer(data.expires_at), 1000);
          
//           // Cleanup function: Stops the timer if the user leaves the page
//           return () => clearInterval(interval);
//         }
//       } catch (err) {
//         // Axios catches any non-2xx status code as an error
//         console.error("Fetch Error:", err);
//         setError(true);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // UI for 404/Expired state
//   if (error) return (
//     <div className="text-center mt-20 text-red-500 font-bold uppercase tracking-widest animate-pulse">
//       404: Paste Not Found or Expired
//     </div>
//   );

//   // UI for Loading state
//   if (!paste) return (
//     <div className="text-center mt-20 text-blue-500 animate-pulse font-mono uppercase tracking-widest">
//       Decrypting Secure Data...
//     </div>
//   );

//   /**
//    * Logic to determine views remaining. 
//    * If backend sends remaining_views directly, use it.
//    * Otherwise, calculate: (Max Views - Current Views).
//    */
//   const remainingViews = paste.remaining_views !== undefined 
//     ? paste.remaining_views 
//     : (paste.max_views ? (paste.max_views - (paste.current_views || 0)) : 'Unlimited');

//   return (
//     <div className="max-w-5xl mx-auto p-8 animate-in fade-in zoom-in duration-500">
//       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
//         {/* Visual Flair: Top blue glow bar */}
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
//         {/* Metadata Header: Views and Expiry Info */}
//         <div className="flex flex-wrap justify-between text-[10px] md:text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold border-b border-slate-800/50 pb-4">
//           <div className="flex gap-4">
//             <span className="flex items-center gap-1">
//               Views Remaining: <span className="text-blue-400">{remainingViews}</span>
//             </span>
//           </div>

//           <div className="flex gap-4">
//             <span className="flex items-center gap-1">
//               Time Left: <span className="text-blue-400 font-mono">{paste.expires_at ? timeLeft : 'Permanent'}</span>
//             </span>
//             <span className="flex items-center gap-1 border-l border-slate-700 pl-4 hidden sm:flex">
//               Expires: <span className="text-slate-400">
//                 {paste.expires_at ? new Date(paste.expires_at).toLocaleString() : 'Never'}
//               </span>
//             </span>
//           </div>
//         </div>

//         {/* Content Box: Pre-formatted text for code/content snippet */}
//         <pre className="text-blue-100 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded-lg border border-white/5">
//           {paste.content}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default ViewPaste;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for cleaner API requests

const ViewPaste = () => {
  const { id } = useParams(); // Extract the unique ID from the URL (/p/:id)
  const [paste, setPaste] = useState(null); // Store paste data (content, views, etc.)
  const [error, setError] = useState(false); // Track if the paste is 404 or expired
  const [timeLeft, setTimeLeft] = useState(''); // Live countdown string

  /**
   * Helper function to calculate time remaining.
   * Defined outside useEffect but inside the component.
   */
  const updateTimer = (expiryDate) => {
    if (!expiryDate) return;
    const diff = new Date(expiryDate) - new Date(); // Calculate difference in milliseconds
    
    // If the current time has passed the expiry time
    if (diff <= 0) {
      setTimeLeft('Expired');
      return;
    }

    // Convert milliseconds into hours, minutes, and seconds
    const h = Math.floor((diff / (1000 * 60 * 60))); 
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    setTimeLeft(`${h}h ${m}m ${s}s`);
  };

  useEffect(() => {
    /**
     * Fetching data using Axios.
     */
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/pastes/${id}`);
        const data = response.data;
        
        /* FIX FOR TIMER:
           Based on your console data, the backend provides 'createdAt' and 'ttl_seconds'.
           We calculate the expiration time manually if 'expires_at' is missing.
        */
        if (data.createdAt && data.ttl_seconds) {
          const creationTime = new Date(data.createdAt).getTime();
          const expiryTimestamp = new Date(creationTime + data.ttl_seconds * 1000);
          data.calculated_expiry = expiryTimestamp; // Attach calculated date to data object
        } else if (data.expires_at) {
          data.calculated_expiry = new Date(data.expires_at);
        }

        setPaste(data);
        
        // Initialize the countdown if an expiry exists
        if (data && data.calculated_expiry) {
          updateTimer(data.calculated_expiry);
          const interval = setInterval(() => updateTimer(data.calculated_expiry), 1000);
          
          return () => clearInterval(interval); // Cleanup function
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  // UI for 404/Expired state
  if (error) return (
    <div className="text-center mt-20 text-red-500 font-bold uppercase tracking-widest animate-pulse">
      404: Paste Not Found or Expired
    </div>
  );

  // UI for Loading state
  if (!paste) return (
    <div className="text-center mt-20 text-blue-500 animate-pulse font-mono uppercase tracking-widest">
      Decrypting Secure Data...
    </div>
  );

  /**
   * Logic to determine views remaining. 
   */
  const remainingViews = paste.remaining_views !== undefined 
    ? paste.remaining_views 
    : (paste.max_views ? (paste.max_views - (paste.current_views || 0)) : 'Unlimited');

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Visual Flair: Top blue glow bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        {/* Metadata Header: Views and Expiry Info */}
        <div className="flex flex-wrap justify-between text-[10px] md:text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold border-b border-slate-800/50 pb-4">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              Views Remaining: <span className="text-blue-400">{remainingViews}</span>
            </span>
          </div>

          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              {/* Uses calculated_expiry to show countdown */}
              Time Left: <span className="text-blue-400 font-mono">{paste.calculated_expiry ? timeLeft : 'Permanent'}</span>
            </span>
            <span className="flex items-center gap-1 border-l border-slate-700 pl-4 hidden sm:flex">
              Expires: <span className="text-slate-400">
                {/* Uses calculated_expiry for the formatted date string */}
                {paste.calculated_expiry ? paste.calculated_expiry.toLocaleString() : 'Never'}
              </span>
            </span>
          </div>
        </div>

        {/* Content Box */}
        <pre className="text-blue-100 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded-lg border border-white/5">
          {paste.content}
        </pre>
      </div>
    </div>
  );
};

export default ViewPaste;