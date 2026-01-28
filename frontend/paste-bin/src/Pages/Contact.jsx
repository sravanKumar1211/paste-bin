import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Code, ExternalLink } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Bio */}
      <div className="text-center mb-12">
        <h2 className="text-white text-4xl font-extrabold mb-6">Contact Me</h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          I am an action-oriented <span className="text-blue-500 font-semibold">MERN Stack Developer</span> with experience in building secure, 
          scalable, and production-grade web applications. I focus on clean architecture, performance, 
          and solving complex problems through algorithmic thinking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Email</p>
              <a href="mailto:sravankumargaddamedhi@gmail.com" className="text-white hover:text-blue-400 transition">
                sravankumargaddamedhi@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone</p>
              <a href="tel:+917032376748" className="text-white hover:text-blue-400 transition">
                +91 7032376748
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
              <p className="text-white">Hyderabad, India</p>
            </div>
          </div>
        </div>

        {/* Professional Profile Links */}
        <div className="grid grid-cols-1 gap-4">
          <a href="https://github.com/sravanKumar1211" target="_blank" rel="noreferrer" 
             className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group">
            <div className="flex items-center gap-4">
              <Github className="text-slate-400 group-hover:text-white" size={28} />
              <span className="text-white font-semibold">GitHub Profile</span>
            </div>
            <ExternalLink size={18} className="text-slate-600 group-hover:text-blue-500" />
          </a>

          <a href="https://www.linkedin.com/in/sravan-kumar-gaddamedhi-89976019a/" target="_blank" rel="noreferrer"
             className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group">
            <div className="flex items-center gap-4">
              <Linkedin className="text-slate-400 group-hover:text-blue-400" size={28} />
              <span className="text-white font-semibold">LinkedIn Profile</span>
            </div>
            <ExternalLink size={18} className="text-slate-600 group-hover:text-blue-500" />
          </a>

          <a href="https://leetcode.com/u/sravan12111999/" target="_blank" rel="noreferrer"
             className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all group">
            <div className="flex items-center gap-4">
              <Code className="text-slate-400 group-hover:text-yellow-500" size={28} />
              <span className="text-white font-semibold">LeetCode / DSA</span>
            </div>
            <ExternalLink size={18} className="text-slate-600 group-hover:text-blue-500" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;