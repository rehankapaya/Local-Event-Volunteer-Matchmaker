
import React from 'react';
import { Link } from 'react-router-dom';
import { Event, EventCategory } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ZapIcon } from './icons/ZapIcon';

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<EventCategory, string> = {
    [EventCategory.Environment]: 'bg-green-100 text-green-800',
    [EventCategory.Community]: 'bg-blue-100 text-blue-800',
    [EventCategory.Education]: 'bg-indigo-100 text-indigo-800',
    [EventCategory.Health]: 'bg-red-100 text-red-800',
    [EventCategory.Animals]: 'bg-yellow-100 text-yellow-800',
    [EventCategory.Arts]: 'bg-purple-100 text-purple-800',
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const registeredCount = event.attendees.length + event.volunteers.length;
  const capacityPercentage = (registeredCount / event.maxCapacity) * 100;

  return (
    <Link to={`/event/${event.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative">
          <img className="h-48 w-full object-cover" src={event.imageUrl} alt={event.title} />
          <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[event.category]}`}>
            {event.category}
          </div>
          {event.isMicro && (
            <div className="absolute top-2 right-2 flex items-center bg-yellow-300 text-yellow-800 px-2 py-1 text-xs font-bold rounded-full">
              <ZapIcon className="w-4 h-4 mr-1"/>
              <span>Micro</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-200">{event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{event.organizer}</p>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-secondary" />
              <span>{new Date(event.date).toDateString()} at {event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2 text-secondary" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1 text-secondary"/>
                    <span>{registeredCount} / {event.maxCapacity}</span>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${capacityPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;