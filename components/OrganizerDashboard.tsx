
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Event, User } from '../types';

interface Applicant extends User {
  eventId: string;
}

const OrganizerDashboard: React.FC = () => {
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [pendingApplicants, setPendingApplicants] = useState<Applicant[]>([]);
  const currentUser = storageService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const allEvents = storageService.getEvents();
      const myEvents = allEvents.filter(event => event.organizer === currentUser.name);
      setOrganizerEvents(myEvents);
      
      const applicants: Applicant[] = [];
      myEvents.forEach(event => {
        event.pendingVolunteers.forEach(userId => {
          const user = storageService.getUserById(userId);
          if (user) {
            applicants.push({ ...user, eventId: event.id });
          }
        });
      });
      setPendingApplicants(applicants);
    }
  }, [currentUser]);

  const handleCancel = (eventId: string) => {
    if (window.confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      storageService.deleteEvent(eventId);
      setOrganizerEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      alert(`Event cancelled successfully.`);
      // Consider forcing a reload or updating state more gracefully
      window.location.reload();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8">
      {/* Event Management Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark">My Events</h2>
          <Link to="/create" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
              + Create Event
          </Link>
        </div>
        {organizerEvents.length > 0 ? (
          <div className="space-y-4">
            {organizerEvents.map(event => {
                const registeredCount = event.attendees.length + event.volunteers.length;
                return (
                    <div key={event.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow">
                    <div className="flex-1 mb-4 md:mb-0">
                        <p className="font-bold text-lg text-primary">{event.title}</p>
                        <p className="text-sm text-gray-500">{new Date(event.date).toDateString()} - {event.location}</p>
                        <p className="text-sm text-gray-600 mt-1">{registeredCount} / {event.maxCapacity} registered ({event.pendingVolunteers.length} pending)</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                        to={`/edit/${event.id}`}
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
                        >
                        Edit
                        </Link>
                        <button
                        onClick={() => handleCancel(event.id)}
                        className="bg-danger text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                );
            })}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-gray-600 text-lg">You haven't created any events yet.</p>
            <p className="text-gray-500 mt-2">Ready to make an impact? Create your first event now.</p>
            <Link to="/create" className="mt-4 inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all">
              Create Event
            </Link>
          </div>
        )}
      </div>

      {/* Volunteer Application Panel */}
      {pendingApplicants.length > 0 && (
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-dark mb-6">Pending Volunteer Applications</h2>
             <div className="space-y-4">
                {pendingApplicants.map(applicant => {
                    const event = organizerEvents.find(e => e.id === applicant.eventId);
                    return (
                        <div key={`${applicant.id}-${applicant.eventId}`} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4 flex-1 mb-4 md:mb-0">
                                <img src={applicant.avatarUrl} alt={applicant.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-bold text-gray-800">{applicant.name}</p>
                                    <p className="text-sm text-gray-500">Applied for: <span className="font-semibold text-primary">{event?.title}</span></p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Approve</button>
                                <button className="bg-warning text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Decline</button>
                            </div>
                        </div>
                    );
                })}
             </div>
         </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
