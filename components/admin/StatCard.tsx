
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-light p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-dark">{value}</p>
      <p className="text-gray-500">{title}</p>
    </div>
  </div>
);

export default StatCard;