import React from 'react';
import { Github, Linkedin, Code, Terminal } from 'lucide-react';

const Footer = () => (
  <footer className="bg-black border-t border-slate-900 py-12 px-6 mt-12 relative overflow-hidden">
    {/* Subtle decorative glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      {/* Brand Section */}
      <div className="flex flex-col items-center md:items-start gap-2">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-blue-500" />
          <span className="text-white font-bold text-xl tracking-tight">
          Pastebin<span className="text-blue-500">Lite</span>
          </span>
        </div>
        <p className="text-slate-500 text-sm max-w-xs text-center md:text-left leading-relaxed">
          Secure, self-destructing text sharing powered by the MERN stack. Developed by Sravan Kumar.
        </p>
      </div>

      {/* Social Links Section */}
      <div className="flex flex-col items-center md:items-end gap-4">
        <div className="flex gap-5 text-slate-400">
          <a 
            href="https://github.com/sravanKumar1211" 
            target="_blank" rel="noreferrer"
            className="hover:text-white hover:scale-110 transition-all p-2 bg-slate-900 border border-slate-800 rounded-lg"
            title="GitHub"
          >
            <Github size={22}/>
          </a>
          <a 
            href="https://www.linkedin.com/in/sravan-kumar-gaddamedhi-89976019a/" 
            target="_blank" rel="noreferrer"
            className="hover:text-blue-500 hover:scale-110 transition-all p-2 bg-slate-900 border border-slate-800 rounded-lg"
            title="LinkedIn"
          >
            <Linkedin size={22}/>
          </a>
          <a 
            href="https://leetcode.com/u/sravan12111999/" 
            target="_blank" rel="noreferrer"
            className="hover:text-yellow-500 hover:scale-110 transition-all p-2 bg-slate-900 border border-slate-800 rounded-lg"
            title="LeetCode"
          >
            <Code size={22}/>
          </a>
        </div>
        <p className="text-slate-600 text-xs font-mono uppercase tracking-[0.2em]">
          © 2026 Built with Passion By Sravan Kumar
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;