
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { User, Event, UserRole } from '../types';
import StatCard from '../components/admin/StatCard';
import EventCategoryChart from '../components/admin/EventCategoryChart';
import { UsersIcon } from '../components/icons/UsersIcon';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { UserCheckIcon } from '../components/icons/UserCheckIcon';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (!user || user.role !== UserRole.Admin) {
      navigate('/login'); // Redirect if not an admin
    } else {
      setCurrentUser(user);
      const users = storageService.getUsers();
      const events = storageService.getEvents();
      setAllUsers(users);
      setAllEvents(events);
      setPendingEvents(events.filter(e => e.status === 'pending'));
    }
  }, [navigate]);

  const stats = useMemo(() => {
    const totalVolunteers = allUsers.filter(u => u.role === UserRole.Volunteer).length;
    return {
      totalUsers: allUsers.length,
      totalEvents: allEvents.length,
      totalVolunteers,
    };
  }, [allUsers, allEvents]);

  const recentUsers = useMemo(() => {
    // In a real app, users would have a createdAt timestamp
    return [...allUsers].reverse().slice(0, 5);
  }, [allUsers]);

  const handleApprove = (eventId: string) => {
    const eventToUpdate = allEvents.find(e => e.id === eventId);
    if (eventToUpdate) {
      const updatedEvent = { ...eventToUpdate, status: 'approved' as 'approved' };
      storageService.updateEvent(updatedEvent);
      // Optimistic update
      setAllEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      setPendingEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const handleReject = (eventId: string) => {
    if (window.confirm("Are you sure you want to reject and delete this event?")) {
      storageService.deleteEvent(eventId);
      // Optimistic update
      setAllEvents(prev => prev.filter(e => e.id !== eventId));
      setPendingEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };


  if (!currentUser) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Platform overview and management.</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon className="w-8 h-8 text-primary"/>} />
        <StatCard title="Total Events" value={stats.totalEvents} icon={<ClipboardListIcon className="w-8 h-8 text-primary"/>} />
        <StatCard title="Active Volunteers" value={stats.totalVolunteers} icon={<UserCheckIcon className="w-8 h-8 text-primary"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <EventCategoryChart events={allEvents} />
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-dark mb-4">Recent Signups</h3>
            <div className="space-y-3">
                {recentUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-3">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full"/>
                        <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Events for Review */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-dark mb-4">Events for Review ({pendingEvents.length})</h2>
        {pendingEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingEvents.map(event => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.organizer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleApprove(event.id)} className="bg-success text-white font-bold py-1 px-3 rounded-md hover:bg-opacity-90">Approve</button>
                      <button onClick={() => handleReject(event.id)} className="bg-danger text-white font-bold py-1 px-3 rounded-md hover:bg-opacity-90">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No events are currently pending approval.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;