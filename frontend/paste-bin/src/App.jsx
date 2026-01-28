import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ViewPaste from './pages/ViewPaste';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-black">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        {/* The :id param captures the unique ID from your shareable link */}
                        <Route path="api/pastes/:id" element={<ViewPaste />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;