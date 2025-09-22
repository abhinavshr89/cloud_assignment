import { useState } from 'react';

const FilterPanel = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-bold mb-3 text-gray-700">Filter Nodes</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-2 text-sm rounded transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🌐 All Nodes
        </button>
        <button
          onClick={() => handleFilterChange('alerts')}
          className={`px-3 py-2 text-sm rounded transition-colors ${
            activeFilter === 'alerts'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔺 Alerts Only
        </button>
        <button
          onClick={() => handleFilterChange('misconfigs')}
          className={`px-3 py-2 text-sm rounded transition-colors ${
            activeFilter === 'misconfigs'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⚙️ Misconfigs Only
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
