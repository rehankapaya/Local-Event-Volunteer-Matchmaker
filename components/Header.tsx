import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Connect<span className="text-secondary">Hub</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Events</Link>
            {/* In a real app, some links might be protected */}
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Dashboard</Link>
            <Link to="/profile" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Profile</Link>
            <Link to="/create" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Create Event</Link>
          </nav>
          <div className="flex items-center space-x-4">
             <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition duration-150 ease-in-out">
                Login
              </Link>
              <Link to="/register" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm">
                Sign Up
              </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;