import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';
import { locationService, Coordinates } from '../services/locationService';
import { Event, Filters, EventCategory } from '../types';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import AIRecommender from '../components/AIRecommender';
import { XCircleIcon } from '../components/icons/XCircleIcon';

const HomePage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    date: 'any',
    categories: [],
    distance: 0,
    isMicro: false,
  });

  useEffect(() => {
    // Fetch events
    setAllEvents(storageService.getEvents());
    setLoading(false);
  }, []);

  // Effect to handle location fetching when a distance filter is selected
  useEffect(() => {
    if (filters.distance > 0 && !userLocation) {
      // Clear previous error when retrying
      if (locationError) setLocationError(null);

      locationService.getUserLocation()
        .then(coords => {
          setUserLocation(coords);
        })
        .catch(error => {
          console.error(error);
          setLocationError(error.message);
          // Reset distance filter on failure to prevent inconsistent state
          setFilters(prev => ({ ...prev, distance: 0 }));
        });
    }
  }, [filters.distance, userLocation]);

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()) + 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return allEvents
      .filter(event => event.status === 'approved') // Only show approved events
      .filter(event => new Date(event.date) >= today) // Only show upcoming events
      .filter(event => {
        // Keyword filter
        const keywordMatch = filters.keyword.toLowerCase()
          ? event.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            event.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            event.location.toLowerCase().includes(filters.keyword.toLowerCase())
          : true;

        // Date filter
        const eventDate = new Date(event.date);
        let dateMatch = true;
        if (filters.date === 'today') {
            dateMatch = eventDate.toDateString() === today.toDateString();
        } else if (filters.date === 'week') {
            dateMatch = eventDate >= today && eventDate < endOfWeek;
        } else if (filters.date === 'month') {
            dateMatch = eventDate >= today && eventDate <= endOfMonth;
        }

        // Category filter
        const categoryMatch = filters.categories.length > 0
          ? filters.categories.includes(event.category)
          : true;

        // Distance filter
        let distanceMatch = true;
        if (filters.distance > 0 && userLocation) {
          const distance = locationService.calculateDistance(userLocation, event.coordinates);
          distanceMatch = distance <= filters.distance;
        }
        
        // Type filter
        const typeMatch = filters.isMicro ? event.isMicro === true : true;
        
        return keywordMatch && dateMatch && categoryMatch && distanceMatch && typeMatch;
      });
  }, [allEvents, filters, userLocation]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark">Find Your Next Opportunity</h1>
        <p className="mt-4 text-lg text-gray-600">Discover local events and volunteer roles that match your passion.</p>
      </div>

      <AIRecommender />
      
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
        />
        <main className="flex-1">
          {locationError && (
            <div className="bg-warning/10 border-l-4 border-warning text-yellow-800 p-4 mb-6 rounded-md relative shadow-md" role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-warning mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
                </div>
                <div>
                  <p className="font-bold">Location Error</p>
                  <p className="text-sm">{locationError}</p>
                </div>
              </div>
              <button onClick={() => setLocationError(null)} className="absolute top-2 right-2 p-1" aria-label="Close alert">
                <XCircleIcon className="h-5 w-5 hover:text-yellow-700"/>
              </button>
            </div>
          )}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : (
             filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-gray-600 text-lg">No events match your criteria.</p>
                    <p className="text-gray-500 mt-2">Try adjusting your filters to find more opportunities.</p>
                </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;