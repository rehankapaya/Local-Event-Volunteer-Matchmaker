
import React from 'react';
import { useParams } from 'react-router-dom';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { UsersIcon } from '../components/icons/UsersIcon';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  const capacityPercentage = (event.registeredUsers / event.maxCapacity) * 100;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img className="h-64 md:h-96 w-full object-cover" src={event.imageUrl} alt={event.title} />
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <span className="text-sm font-semibold text-primary">{event.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-dark mt-1">{event.title}</h1>
              <p className="text-md text-gray-500 mt-2">Organized by {event.organizer}</p>
            </div>
            <button className="mt-4 md:mt-0 w-full md:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md">
              Sign Up / Volunteer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-b border-gray-200 py-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold text-gray-800">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
             <div className="flex items-center space-x-3">
              <UsersIcon className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold text-gray-800">Capacity</p>
                <p className="text-gray-600">{event.registeredUsers} of {event.maxCapacity} spots filled</p>
                 <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${capacityPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              
              <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {event.requiredSkills.map(skill => (
                  <span key={skill} className="bg-light text-primary font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Event Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">[Map Placeholder]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
