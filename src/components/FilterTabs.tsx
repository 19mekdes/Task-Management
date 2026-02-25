// src/components/FilterTabs.tsx
import React from 'react';
import type { FilterType } from '../types/task.types';

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, onFilterChange, counts }) => {
  const filters: { type: FilterType; label: string; count: number }[] = [
    { type: 'all', label: 'All', count: counts.all },
    { type: 'pending', label: 'Pending', count: counts.pending },
    { type: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex space-x-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.type}
          onClick={() => onFilterChange(filter.type)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            currentFilter === filter.type
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{filter.label}</span>
          <span className={`text-sm rounded-full px-2 py-0.5 ${
            currentFilter === filter.type
              ? 'bg-blue-400 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;