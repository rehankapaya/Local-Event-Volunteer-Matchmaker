import React from 'react';
import { mockVolunteerStats } from '../data/mockData';
import { VolunteerStat } from '../types';

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
  const stats: VolunteerStat = mockVolunteerStats;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Hours Volunteered" value={stats.totalHours} icon="⏱️" />
        <StatCard title="Events Participated" value={stats.eventsVolunteered} icon="🎉" />
        <StatCard title="Causes Supported" value={stats.causesSupported} icon="❤️" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-dark mb-6">My Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <Badge name="Community Hero" icon="🏆" />
          <Badge name="Eco Warrior" icon="🌿" />
          <Badge name="Helping Hand" icon="🤝" />
          <Badge name="Animal Lover" icon="🐾" />
          <Badge name="Education Champion" icon="🎓" />
        </div>
      </div>
    </>
  );
};

export default VolunteerDashboard;
