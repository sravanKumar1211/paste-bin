import React from 'react';
import { Database, Server, Globe, Shield } from 'lucide-react';

const About = () => {
  // Define the stack details to map through them for clean UI
  const stack = [
    {
      name: "MongoDB",
      icon: <Database className="text-green-500" />,
      desc: "Cloud-hosted via Atlas, it stores pastes as documents with automatic TTL indices for self-destruction."
    },
    {
      name: "Express.js",
      icon: <Server className="text-slate-400" />,
      desc: "A minimalist framework providing the RESTful API endpoints for creating and retrieving pastes."
    },
    {
      name: "React.js",
      icon: <Globe className="text-blue-400" />,
      desc: "The interface layer, styled with Tailwind CSS, utilizing React Router for dynamic paste viewing."
    },
    {
      name: "Node.js",
      icon: <Shield className="text-green-600" />,
      desc: "The runtime environment that coordinates data between the frontend and the database securely."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="mb-16 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
          About <span className="text-blue-500">Pastebin-Lite</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Pastebin-Lite is a security-focused text-sharing utility designed for 
          developers who need to share code snippets or logs that shouldn't stay 
          online forever. By implementing <span className="text-blue-400 font-semibold">Self-Destruction</span> 
          logic, data is purged based on time or view limits.
        </p>
      </section>

      {/* Technical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {stack.map((item, index) => (
          <div key={index} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <h3 className="text-white font-bold text-lg">{item.name}</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Project Logic Description */}
      <section className="bg-blue-600/5 border border-blue-500/20 rounded-3xl p-8">
        <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
          How it Works
        </h2>
        <div className="space-y-4 text-slate-300">
          <p>
            When you hit <span className="text-blue-400 italic">"Create Paste"</span>, the frontend sends 
            your text and constraints to our Node/Express server. The server generates a unique ID 
            and stores the data in MongoDB.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm ml-2">
            <li><strong className="text-slate-200">Time-To-Live (TTL):</strong> If set, the paste expires after a specific number of seconds.</li>
            <li><strong className="text-slate-200">View Constraints:</strong> Every time a link is visited, a backend increment operation occurs. Once the limit is reached, the paste is logically deleted.</li>
            <li><strong className="text-slate-200">Security:</strong> No user tracking or persistent logs—data is transient by design.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;