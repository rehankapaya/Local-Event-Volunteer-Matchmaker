
import React, { useMemo } from 'react';
import { storageService } from '../services/storageService';
import { VolunteerStat, EventCategory } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-gray-500">{title}</p>
    </div>
  </div>
);

const Badge: React.FC<{ name: string; icon: string }> = ({ name, icon }) => (
  <div className="text-center">
    <div className="text-6xl mb-2">
      {icon}
    </div>
    <p className="font-semibold text-gray-700">{name}</p>
  </div>
);


const VolunteerDashboard: React.FC = () => {
  const currentUser = storageService.getCurrentUser();

  const dynamicStats = useMemo((): VolunteerStat => {
    if (!currentUser) {
      return { totalHours: 0, causesSupported: 0, eventsVolunteered: 0, badges: [] };
    }

    const allEvents = storageService.getEvents();
    const now = new Date();

    const volunteeredEventIds = currentUser.registeredEvents
      .filter(reg => reg.role === 'volunteer')
      .map(reg => reg.eventId);

    const pastVolunteeredEvents = allEvents.filter(event =>
      volunteeredEventIds.includes(event.id) && new Date(event.date) < now
    );
    
    const calculateDuration = (timeStr: string): number => {
        try {
            const [startTimeStr, endTimeStr] = timeStr.split(' - ');
            
            const parseTime = (time: string) => {
              let [hhmm, ampm] = time.split(' ');
              let [hours, minutes] = hhmm.split(':').map(Number);
              if (ampm && ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
              if (ampm && ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
              return { hours, minutes };
            }
            
            const start = parseTime(startTimeStr);
            const end = parseTime(endTimeStr);

            const startDate = new Date();
            startDate.setHours(start.hours, start.minutes, 0, 0);

            const endDate = new Date();
            endDate.setHours(end.hours, end.minutes, 0, 0);

            let diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            if (diff < 0) diff += 24; // Handles overnight events
            return Math.round(diff * 10) / 10;
        } catch (e) {
            console.error("Could not parse time string:", timeStr, e);
            return 2; // Default to 2 hours if parsing fails
        }
    };
    
    const totalHours = pastVolunteeredEvents.reduce((acc, event) => acc + calculateDuration(event.time), 0);
    const eventsVolunteered = pastVolunteeredEvents.length;
    const causesSupported = new Set(pastVolunteeredEvents.map(e => e.category)).size;

    // Badge logic
    const badges: string[] = [];
    if (totalHours >= 50) badges.push('Helping Hand');
    if (eventsVolunteered >= 5) badges.push('Community Hero');
    if (pastVolunteeredEvents.filter(e => e.category === EventCategory.Environment).length >= 2) badges.push('Eco Warrior');
    if (pastVolunteeredEvents.filter(e => e.category === EventCategory.Animals).length >= 2) badges.push('Animal Lover');
    if (pastVolunteeredEvents.filter(e => e.category === EventCategory.Education).length >= 2) badges.push('Education Champion');

    return { totalHours, eventsVolunteered, causesSupported, badges };
  }, [currentUser]);

  const badgeIcons: Record<string, string> = {
    'Community Hero': '🏆',
    'Eco Warrior': '🌿',
    'Helping Hand': '🤝',
    'Animal Lover': '🐾',
    'Education Champion': '🎓',
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Hours Volunteered" value={dynamicStats.totalHours} icon="⏱️" />
        <StatCard title="Events Participated" value={dynamicStats.eventsVolunteered} icon="🎉" />
        <StatCard title="Causes Supported" value={dynamicStats.causesSupported} icon="❤️" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-dark mb-6">My Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {dynamicStats.badges.length > 0 ? (
                dynamicStats.badges.map(badge => (
                    <Badge key={badge} name={badge} icon={badgeIcons[badge] || '🌟'} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500">Volunteer at events to earn badges!</p>
            )}
        </div>
      </div>
    </>
  );
};

export default VolunteerDashboard;