import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Top Bar - Hidden when sidebar is open */}
      {!isOpen && (
        <div className="w-full flex items-center justify-between px-4 py-3 bg-green-700 text-white fixed top-0 z-50">
          <div className="flex items-center gap-2">
            <button onClick={toggleSidebar}>
              <FaBars size={24} />
            </button>
            <h1 className="text-xl font-bold">Epic Journey Rentals</h1>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-600 text-white transition-transform duration-300 z-50 pt-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4 text-white">
          <Link to="/" className="hover:text-orange-400" onClick={toggleSidebar}>Home</Link>
          <Link to="/about" className="hover:text-orange-400" onClick={toggleSidebar}>About</Link>
          <Link to="/contact" className="hover:text-orange-400" onClick={toggleSidebar}>Contact</Link>
          <Link to="/rent" className="hover:text-orange-400" onClick={toggleSidebar}>Rent</Link>
          <Link to="/lease" className="hover:text-orange-400" onClick={toggleSidebar}>Lease</Link>
          <Link to="/howitworks" className="hover:text-orange-400" onClick={toggleSidebar}>How It Works</Link>
          <Link to="/auth" className="hover:text-orange-400" onClick={toggleSidebar}>Login</Link>
          <Link to="/register" className="hover:text-orange-400" onClick={toggleSidebar}>Register</Link>
          <Link to="/items" className="hover:text-orange-400" onClick={toggleSidebar}>All Items</Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
