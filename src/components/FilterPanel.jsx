import { useFilter } from '../hooks/useFilter';

const FilterPanel = () => {
  const { handleFilterChange, filter } = useFilter();

  const filters = [
    { key: 'all', label: '🌐 All Nodes', colorClass: 'bg-blue-500' },
    { key: 'alerts', label: '🔺 Alerts Only', colorClass: 'bg-red-500' },
    { key: 'misconfigs', label: '⚙️ Misconfigs Only', colorClass: 'bg-orange-500' }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-lg border">
      
      <div className="flex gap-2">
        {filters.map(({ key, label, colorClass }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={`px-3 py-2 text-xs rounded transition-colors whitespace-nowrap ${
              filter === key 
                ? `${colorClass} text-white` 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
