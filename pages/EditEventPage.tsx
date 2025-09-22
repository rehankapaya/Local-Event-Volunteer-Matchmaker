import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, EventCategory } from '../types';
import { mockEvents } from '../data/mockData';

const EditEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // FIX: The state for form data was incorrectly typed as Partial<Event>.
  // Form inputs provide string values, so the state type is adjusted to reflect this
  // for fields like `requiredSkills` and `maxCapacity`, resolving type errors.
  const [eventData, setEventData] = useState<Partial<Omit<Event, 'requiredSkills' | 'maxCapacity'> & {
    requiredSkills: string;
    maxCapacity: string | number;
  }>>({});

  useEffect(() => {
    const eventToEdit = mockEvents.find(e => e.id === id);
    if (eventToEdit) {
      setEventData({
        ...eventToEdit,
        requiredSkills: (eventToEdit.requiredSkills || []).join(', '),
      });
    } else {
      // Handle case where event is not found
      navigate('/dashboard');
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEventData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating event:", {
        ...eventData,
        // FIX: The type of eventData.requiredSkills is now correctly inferred as string | undefined,
        // so the 'split' method is available after the type guard.
        requiredSkills: typeof eventData.requiredSkills === 'string' ? eventData.requiredSkills.split(',').map(s => s.trim()) : [],
        maxCapacity: Number(eventData.maxCapacity),
    });
    alert('Event updated successfully! (Check console for data)');
    navigate('/dashboard');
  };
  
   const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this event? This action cannot be undone.")) {
      console.log(`Event ${id} has been cancelled.`);
      alert(`Event ${id} cancelled successfully.`);
      navigate('/dashboard');
    }
  };

  if (!eventData.title) {
      return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-dark mb-6">Edit Event</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" id="title" value={eventData.title || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={4} value={eventData.description || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={eventData.date || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" id="time" value={eventData.time || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

           <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" value={eventData.location || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="category" value={eventData.category || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                {Object.values(EventCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input type="number" id="maxCapacity" value={eventData.maxCapacity || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
            <input type="text" id="requiredSkills" value={eventData.requiredSkills || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>

          <div className="flex justify-between items-center">
             <button
              type="button"
              onClick={handleCancel}
              className="bg-danger text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
            >
              Cancel Event
            </button>
            <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
