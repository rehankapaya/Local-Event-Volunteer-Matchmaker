
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-12">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">ConnectHub</h3>
            <p className="text-gray-300">Connecting communities, one event at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} ConnectHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
