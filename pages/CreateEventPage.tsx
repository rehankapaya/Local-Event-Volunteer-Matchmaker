
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, EventCategory } from '../types';
import { storageService } from '../services/storageService';

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = storageService.getCurrentUser();

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: EventCategory.Community,
    maxCapacity: '',
    requiredSkills: '',
    image: null as File | null,
    isMicro: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (e.target.type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setEventData(prev => ({ ...prev, [id]: checked }));
    } else {
        setEventData(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        alert("You must be logged in to create an event.");
        navigate('/login');
        return;
    }

    const newEvent: Event = {
        id: `e${Date.now()}`,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        requiredSkills: eventData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        maxCapacity: parseInt(eventData.maxCapacity, 10) || 0,
        organizer: currentUser.name,
        imageUrl: `https://picsum.photos/seed/${eventData.title.replace(/\s/g, '')}/600/400`,
        coordinates: { lat: 47.6062, lng: -122.3321 }, // Default to Seattle, WA for simplicity
        attendees: [],
        volunteers: [],
        pendingVolunteers: [],
        waitlist: [],
        status: 'pending',
        isMicro: eventData.isMicro,
    };

    storageService.addEvent(newEvent);
    alert('Event created successfully! It is now pending admin approval.');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-dark mb-6">Create a New Event</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
            <input type="text" id="title" value={eventData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={4} value={eventData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={eventData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" id="time" value={eventData.time} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

           <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" value={eventData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="category" value={eventData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                {Object.values(EventCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input type="number" id="maxCapacity" value={eventData.maxCapacity} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>

          <div>
            <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
            <input type="text" id="requiredSkills" value={eventData.requiredSkills} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" id="isMicro" checked={eventData.isMicro} onChange={handleChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label htmlFor="isMicro" className="ml-2 block text-sm font-medium text-gray-700">Micro-Volunteering (short, flexible task)</label>
          </div>

          <div>
             <label htmlFor="image" className="block text-sm font-medium text-gray-700">Event Poster/Image</label>
             <input type="file" id="image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100" />
          </div>

          <div className="text-right">
            <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md">
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;