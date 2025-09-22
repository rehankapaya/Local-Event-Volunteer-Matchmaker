
import { GoogleGenAI, Type } from "@google/genai";
import { User, Event, AIRecommendation } from '../types';

const getGeminiService = () => {
  if (!process.env.API_KEY) {
    // Return a mock service if API key is not available
    console.warn("API_KEY environment variable not set. Using mock Gemini service.");
    return {
      getAIRecommendations: async (user: User, events: Event[]): Promise<AIRecommendation[]> => {
        // Mock logic: recommend events that match user's interests
        const recommendedEvents = events.filter(event => user.interests.includes(event.category));
        return recommendedEvents.slice(0, 3).map(event => ({
          eventId: event.id,
          reason: `This ${event.category} event matches your interests and is a great opportunity.`,
          event: event,
        }));
      }
    };
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  return {
    getAIRecommendations: async (user: User, events: Event[]): Promise<AIRecommendation[]> => {
      const prompt = `
        You are an AI assistant for the "Local Event & Volunteer Matchmaker" platform.
        Your goal is to provide personalized event recommendations to users.

        User Profile:
        - Name: ${user.name}
        - Location: ${user.location}
        - Bio: ${user.bio}
        - Skills: ${user.skills.join(', ')}
        - Interests: ${user.interests.join(', ')}

        Available Events:
        ${events.map(e => `
          - Event ID: ${e.id}
          - Title: ${e.title}
          - Description: ${e.description}
          - Category: ${e.category}
          - Required Skills: ${e.requiredSkills.join(', ')}
          - Location: ${e.location}
        `).join('\n')}

        Based on the user's profile and the list of available events, please recommend the top 3 most suitable events.
        For each recommendation, provide the event ID and a brief, encouraging reason (20-30 words) explaining why it's a great match for the user's skills and interests.
      `;
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      eventId: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        const recommendations: AIRecommendation[] = result.recommendations.map((rec: any) => ({
            ...rec,
            event: events.find(e => e.id === rec.eventId)
        }));

        return recommendations.filter(rec => rec.event);

      } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Fallback to mock logic on API error
        const mockService = getGeminiService(); // re-call to get mock version
        return mockService.getAIRecommendations(user, events);
      }
    }
  };
};

export const geminiService = getGeminiService();
