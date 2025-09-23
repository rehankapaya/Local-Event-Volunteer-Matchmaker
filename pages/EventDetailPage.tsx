
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Event } from '../types';
import { MapPinIcon } from '../components/icons/MapPinIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import Map from '../components/Map';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = storageService.getEvents().find((e) => e.id === id);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  if (!event) {
    return <div className="text-center py-20">Event not found.</div>;
  }

  const registeredCount = event.attendees.length + event.volunteers.length;
  const capacityPercentage = (registeredCount / event.maxCapacity) * 100;
  
  const parseEventTime = (dateStr: string, timeStr: string): { startDate: Date; endDate: Date } => {
    const [startTimeStr, endTimeStr] = timeStr.split(' - ');

    const parseTime = (time: string) => {
        let [hhmm, ampm] = time.split(' ');
        let [hours, minutes] = hhmm.split(':').map(Number);
        if (ampm && ampm.toLowerCase() === 'pm' && hours < 12) {
            hours += 12;
        }
        if (ampm && ampm.toLowerCase() === 'am' && hours === 12) { // Midnight case
            hours = 0;
        }
        const date = new Date(dateStr);
        // This sets it in local time, which is what we want
        date.setHours(hours, minutes, 0, 0);
        return date;
    };
    
    const startDate = parseTime(startTimeStr);
    const endDate = parseTime(endTimeStr);
    
    return { startDate, endDate };
  };
  
  const handleAddToCalendar = (type: 'google' | 'ics') => {
    const { startDate, endDate } = parseEventTime(event.date, event.time);

    const toGoogleISO = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    
    if (type === 'google') {
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toGoogleISO(startDate)}/${toGoogleISO(endDate)}&details=${details}&location=${location}`;
        window.open(url, '_blank');
    } else if (type === 'ics') {
        const toICSDate = (date: Date) => date.toISOString().replace(/[-:.]/g, '') + 'Z';
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `URL:${document.location.href}`,
            `DTSTART:${toICSDate(startDate)}`,
            `DTEND:${toICSDate(endDate)}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${event.title}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    setShowCalendarOptions(false);
  };


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
             <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative inline-block text-left w-full sm:w-auto">
                    <div>
                        <button onClick={() => setShowCalendarOptions(!showCalendarOptions)} type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        Add to Calendar
                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
                        </button>
                    </div>
                    {showCalendarOptions && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                        <div className="py-1" role="none">
                            <button onClick={() => handleAddToCalendar('google')} className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Google Calendar</button>
                            <button onClick={() => handleAddToCalendar('ics')} className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" role="menuitem">Outlook/Apple (.ics)</button>
                        </div>
                        </div>
                    )}
                </div>
                <button className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md">
                    Sign Up / Volunteer
                </button>
            </div>
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
                <p className="text-gray-600">{registeredCount} of {event.maxCapacity} spots filled</p>
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
              <div className="rounded-lg overflow-hidden shadow-md">
                 <Map center={event.coordinates} />
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates.lat},${event.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;