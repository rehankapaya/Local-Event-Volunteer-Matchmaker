import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User, Event } from '../types';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [eventHistory, setEventHistory] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      
      // Simulate fetching user's event history
      const allEvents = storageService.getEvents();
      // Filter for past events to simulate a history
      const pastEvents = allEvents.filter(event => new Date(event.date) < new Date());
      // Just show a couple for demonstration
      setEventHistory(pastEvents.slice(0, 3)); 
    }
  }, [navigate]);

  if (!user) {
    return <div className="text-center p-10">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <div className="flex-shrink-0">
            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
            <button className="w-full mt-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-dark">{user.name}</h1>
            <p className="text-md text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            <p className="mt-4 text-gray-700 leading-relaxed">{user.bio}</p>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <span key={interest} className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Event History Section */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Event History</h2>
          {eventHistory.length > 0 ? (
            <div className="space-y-4">
              {eventHistory.map(event => (
                <div key={event.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200">
                  <CheckCircleIcon className="w-6 h-6 text-success mr-4 flex-shrink-0"/>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()} - Attended as {user.role.toLowerCase()}
                    </p>
                  </div>
                   <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      Completed
                    </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no event history yet. Go out and make an impact!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;