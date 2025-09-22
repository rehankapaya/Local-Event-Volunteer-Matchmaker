
import React, { useState, useEffect } from 'react';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import AIRecommender from '../components/AIRecommender';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark">Find Your Next Opportunity</h1>
        <p className="mt-4 text-lg text-gray-600">Discover local events and volunteer roles that match your passion.</p>
      </div>

      <AIRecommender />
      
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <main className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
