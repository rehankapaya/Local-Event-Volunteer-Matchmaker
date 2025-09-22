
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { mockUsers, mockEvents } from '../data/mockData';
import { AIRecommendation } from '../types';
import EventCard from './EventCard';

const AIRecommender: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using mock user and events for this demo
        const user = mockUsers[0];
        const events = mockEvents;
        const result = await geminiService.getAIRecommendations(user, events);
        setRecommendations(result);
      } catch (err) {
        setError("Failed to fetch AI recommendations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchRecommendations();
  }, []);

  return (
    <div className="bg-light p-6 rounded-lg shadow-lg my-8">
      <h2 className="text-2xl font-bold text-dark mb-4">✨ Recommended For You</h2>
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
