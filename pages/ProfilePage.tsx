
import React from 'react';
import { mockUsers } from '../data/mockData';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const user: User = mockUsers[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <div className="flex-shrink-0">
            <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full object-cover shadow-lg" />
            <button className="w-full mt-4 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-dark">{user.name}</h1>
            <p className="text-md text-gray-500">{user.role}</p>
            <p className="mt-4 text-gray-700 leading-relaxed">{user.bio}</p>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">My Interests</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => (
                  <span key={interest} className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
