import React from 'react';
import { EventCategory } from '../types';
import type { Filters } from '../types';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}


const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value as EventCategory;
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange('categories', newCategories);
  };
    
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-white p-6 rounded-lg shadow-md self-start">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Filters</h3>
      
      {/* Search by keyword */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
        <input 
            type="text" 
            id="search" 
            placeholder="Search events..."
            value={filters.keyword}
            onChange={e => onFilterChange('keyword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter by Date */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Date</h4>
        <div className="space-y-2">
          {['any', 'today', 'week', 'month'].map(dateRange => (
             <button 
                key={dateRange}
                onClick={() => onFilterChange('date', dateRange as Filters['date'])}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors capitalize ${filters.date === dateRange ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-secondary hover:text-white'}`}
             >
                {dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'This Month' : dateRange}
             </button>
          ))}
        </div>
      </div>
      
      {/* Filter by Category */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
        <div className="space-y-2">
          {Object.values(EventCategory).map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                value={category}
                checked={filters.categories.includes(category)}
                onChange={handleCategoryChange}
                className="rounded text-primary focus:ring-primary" 
              />
              <span className="text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filter by Type */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Opportunity Type</h4>
        <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={filters.isMicro}
                onChange={e => onFilterChange('isMicro', e.target.checked)}
                className="rounded text-primary focus:ring-primary" 
              />
              <span className="text-gray-600">Micro-Volunteering</span>
            </label>
        </div>
      </div>

      {/* Filter by Location */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Distance</h4>
        <div className="space-y-2">
            {[0, 5, 10, 25].map(dist => (
                <label key={dist} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="distance"
                    value={dist}
                    checked={filters.distance === dist}
                    onChange={() => onFilterChange('distance', dist)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-gray-600">{dist === 0 ? 'Any distance' : `Within ${dist} km`}</span>
                </label>
            ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;