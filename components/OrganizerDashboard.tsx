import React from 'react';
import { Link } from 'react-router-dom';
import { mockEvents, currentUser } from '../data/mockData';

const OrganizerDashboard: React.FC = () => {
  // Filter events to show only those created by the current organizer
  const organizerEvents = mockEvents.filter(event => event.organizer === currentUser.name);
  
  const handleCancel = (eventId: string) => {
    if (window.confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      // In a real app, you'd make an API call to delete the event.
      // Here, we'll just log it.
      console.log(`Event ${eventId} has been cancelled.`);
      alert(`Event ${eventId} cancelled successfully.`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-dark mb-6">My Events</h2>
      {organizerEvents.length > 0 ? (
        <div className="space-y-4">
          {organizerEvents.map(event => (
            <div key={event.id} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex-1 mb-4 md:mb-0">
                <p className="font-bold text-lg text-primary">{event.title}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toDateString()} - {event.location}</p>
                 <p className="text-sm text-gray-600 mt-1">{event.registeredUsers} / {event.maxCapacity} registered</p>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">You haven't created any events yet.</p>
          <Link to="/create" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all">
            Create Your First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
