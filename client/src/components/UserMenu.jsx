// src/components/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = ({ isMobile, onCloseMobileMenu }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // ✅ CRITICAL: Add this null check at the beginning
  if (!user) {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-white text-center border-b border-gray-600 pb-4">
          <p className="font-semibold">Welcome back!</p>
          <p className="text-green-400">{user.firstName} {user.lastName}</p>
        </div>
        <Link 
          to="/profile" 
          onClick={onCloseMobileMenu}
          className="text-white text-center hover:text-green-400"
        >
          My Profile
        </Link>
        <button 
          onClick={handleLogout}
          className="text-white border border-red-500 px-4 py-2 rounded hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
      >
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <span className="font-medium">
          {user.firstName} {user.lastName}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user.firstName} {user.lastName}
            </p>
          </div>
          
          <Link 
            to="/profile" 
            onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </Link>
          
          <Link 
            to="/settings" 
            onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;