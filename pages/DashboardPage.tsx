import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types';
import VolunteerDashboard from '../components/VolunteerDashboard';
import OrganizerDashboard from '../components/OrganizerDashboard';

const DashboardPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
    setLoading(false);
  }, [navigate]);

  if (loading || !currentUser) {
    return <div className="text-center p-10">Loading...</div>;
  }
  
  const isOrganizer = currentUser.role === UserRole.Organizer;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-20 h-20 rounded-full object-cover shadow-md" />
        <div>
          <h1 className="text-3xl font-bold text-dark">
            {isOrganizer ? 'Event Management' : 'My Impact Dashboard'}
          </h1>
          <p className="text-lg text-gray-600">Welcome back, {currentUser.name}!</p>
        </div>
      </div>
      
      {isOrganizer ? <OrganizerDashboard /> : <VolunteerDashboard />}
    </div>
  );
};

export default DashboardPage;