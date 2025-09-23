
import React, { useState, useEffect } from 'react';
// FIX: Import 'Link' from 'react-router-dom' to be used for navigation.
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { AIRecommendation, User, Event } from '../types';
import EventCard from './EventCard';

const AIRecommender: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const events = storageService.getEvents();
        const result = await geminiService.getAIRecommendations(user, events);
        setRecommendations(result);
      } catch (err) {
        setError("Failed to fetch AI recommendations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  if (!currentUser) {
    return (
       <div className="bg-light p-6 rounded-lg shadow-lg my-8 text-center">
         <h2 className="text-2xl font-bold text-dark mb-2">✨ Recommended For You</h2>
         <p className="text-gray-600">Please <Link to="/login" className="text-primary font-semibold hover:underline">log in</Link> to see personalized recommendations.</p>
       </div>
    )
  }

  return (
    <div className="bg-light p-6 rounded-lg shadow-lg my-8">
      <h2 className="text-2xl font-bold text-dark mb-4">✨ Recommended For You, {currentUser.name.split(' ')[0]}</h2>
      {loading && <p className="text-center text-gray-600">Generating personalized recommendations...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.length > 0 ? recommendations.map((rec) => (
            rec.event ? (
              <div key={rec.eventId}>
                <EventCard event={rec.event} />
                <div className="mt-2 p-3 bg-white rounded-b-lg shadow-inner">
                   <p className="text-sm text-gray-700 italic">" {rec.reason} "</p>
                </div>
              </div>
            ) : null
          )) : <p className="col-span-3 text-center text-gray-600">No specific recommendations found at this time.</p>}
        </div>
      )}
    </div>
  );
};

export default AIRecommender;