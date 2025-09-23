import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';
import { locationService, Coordinates } from '../services/locationService';
import { Event, Filters } from '../types';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import AIRecommender from '../components/AIRecommender';

const HomePage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<PermissionState | 'unknown'>('unknown');

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

    // Check for location permission status on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        setLocationPermissionStatus(permissionStatus.state);
        // Listen for changes in permission status
        permissionStatus.onchange = () => {
          setLocationPermissionStatus(permissionStatus.state);
        };
      });
    } else {
      // Fallback for browsers that don't support the Permissions API
      setLocationPermissionStatus('prompt');
    }
  }, []);

  // Effect to handle location fetching and state updates based on permission
  useEffect(() => {
    // If a distance filter is selected, and we have permission, get location
    if (filters.distance > 0 && !userLocation && locationPermissionStatus !== 'denied') {
      locationService.getUserLocation()
        .then(coords => {
          setUserLocation(coords);
        })
        .catch(error => {
          console.error(error);
          // If user denies the prompt, this will catch. Reset the filter.
          setFilters(prev => ({ ...prev, distance: 0 }));
        });
    }

    // If permission is or becomes denied, ensure distance filter is reset as a safeguard.
    if (locationPermissionStatus === 'denied' && filters.distance > 0) {
      setFilters(prev => ({ ...prev, distance: 0 }));
    }
  }, [filters.distance, userLocation, locationPermissionStatus]);

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
            locationPermissionStatus={locationPermissionStatus}
        />
        <main className="flex-1">
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