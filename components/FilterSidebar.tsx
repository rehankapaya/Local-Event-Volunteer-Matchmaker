
import React from 'react';
import { EventCategory } from '../types';

const FilterSidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
      
      {/* Search by keyword */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
        <input type="text" id="search" placeholder="Search events..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
      </div>

      {/* Filter by Date */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Date</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-secondary hover:text-white rounded-md transition-colors">Today</button>
          <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-secondary hover:text-white rounded-md transition-colors">This Week</button>
          <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-secondary hover:text-white rounded-md transition-colors">This Month</button>
        </div>
      </div>
      
      {/* Filter by Category */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
        <div className="space-y-2">
          {Object.values(EventCategory).map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              <span className="text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter by Location */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Distance</h4>
        <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="distance" className="text-primary focus:ring-primary" />
              <span className="text-gray-600">Within 2 km</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="distance" className="text-primary focus:ring-primary" />
              <span className="text-gray-600">Within 5 km</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="distance" className="text-primary focus:ring-primary" />
              <span className="text-gray-600">Within 10 km</span>
            </label>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
