// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent px-4 md:px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 z-50">
        <div className="bg-green-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">BH</div>
        <span className="text-white text-xl font-semibold">BetaHouse</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-8 text-white font-medium">
        <Link to="/" className="hover:text-green-400 transition-colors">Home</Link>
        <Link to="/properties" className="hover:text-green-400 transition-colors">Properties</Link>
        <Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link>
        <Link to="/blog" className="hover:text-green-400 transition-colors">Blog</Link>
        <Link to="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link>
      </nav>

      {/* Desktop Auth */}
      <div className="hidden md:flex gap-4 items-center">
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/signup" className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">Sign Up</Link>
            <Link to="/login" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">Login</Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden text-white text-2xl z-50" 
        aria-label="Toggle Menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center gap-6 z-40">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            <FaTimes />
          </button>
          
          {/* Logo in Mobile Menu */}
          <div className="absolute top-4 left-4">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="bg-green-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">BH</div>
              <span className="text-white text-xl font-semibold">BetaHouse</span>
            </Link>
          </div>

          <nav className="flex flex-col items-center gap-6 mt-16">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-white text-xl hover:text-green-400 transition-colors">Home</Link>
            <Link to="/properties" onClick={() => setIsOpen(false)} className="text-white text-xl hover:text-green-400 transition-colors">Properties</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-white text-xl hover:text-green-400 transition-colors">About Us</Link>
            <Link to="/blog" onClick={() => setIsOpen(false)} className="text-white text-xl hover:text-green-400 transition-colors">Blog</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-white text-xl hover:text-green-400 transition-colors">Contact Us</Link>
          </nav>

          <div className="flex flex-col gap-4 w-[90%] max-w-sm px-4 mt-8">
            {user ? (
              <UserMenu isMobile onCloseMobileMenu={() => setIsOpen(false)} />
            ) : (
              <>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)} 
                  className="text-white border border-white px-4 py-3 text-center rounded hover:bg-white hover:text-black transition-colors text-lg"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="bg-green-500 text-white px-4 py-3 text-center rounded hover:bg-green-600 transition-colors text-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;