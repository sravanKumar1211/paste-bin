import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-black border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
      Pastebin<span className="text-white">Lite</span>
    </Link>
    <div className="space-x-8 text-slate-400 font-medium">
      <Link to="/" className="hover:text-blue-400 transition">Home</Link>
      <Link to="/about" className="hover:text-blue-400 transition">About</Link>
      <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
    </div>
  </nav>
);
export default Navbar;