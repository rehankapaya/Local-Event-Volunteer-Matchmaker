
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User, UserRole, Notification } from '../types';
import { BellIcon } from './icons/BellIcon';

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setNotifications(storageService.getNotificationsForUser(user.id));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setNotifications([]);
    setIsPanelOpen(false);
    navigate('/');
    window.location.reload(); // Force reload to ensure all states are cleared
  };

  const handleTogglePanel = () => {
    setIsPanelOpen(prev => !prev);
    if (!isPanelOpen && currentUser) {
      // Mark as read when opening the panel
      storageService.markNotificationsAsRead(currentUser.id);
      // Optimistically update UI
      setNotifications(prev => prev.map(n => ({...n, read: true})))
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };


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
            {currentUser && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Dashboard</Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Profile</Link>
                {currentUser.role === UserRole.Organizer && 
                  <Link to="/create" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">Create Event</Link>
                }
                 {currentUser.role === UserRole.Admin && 
                  <Link to="/admin" className="text-gray-600 hover:text-primary transition duration-150 ease-in-out font-semibold text-danger">Admin</Link>
                }
              </>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {currentUser ? (
               <>
                <div className="relative" ref={notificationRef}>
                  <button onClick={handleTogglePanel} className="relative text-gray-500 hover:text-primary focus:outline-none">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white text-xs font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isPanelOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
                      <div className="py-2 px-4 font-bold text-gray-700 border-b">Notifications</div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(n => (
                            <Link to={n.eventId ? `/event/${n.eventId}` : '#'} key={n.id} className="block px-4 py-3 hover:bg-gray-100 border-b last:border-b-0">
                              <p className="text-sm text-gray-700">{n.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{timeSince(n.timestamp)}</p>
                            </Link>
                          ))
                        ) : (
                          <p className="text-center py-4 text-sm text-gray-500">No new notifications.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-gray-700 font-medium hidden sm:inline">Hi, {currentUser.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm"
                >
                  Logout
                </button>
               </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition duration-150 ease-in-out">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;