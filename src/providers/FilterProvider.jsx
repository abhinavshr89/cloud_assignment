import { useState, useCallback } from 'react';
import { FilterContext } from '../context/FilterContext';

// Provider component handles all the state logic
export const FilterProvider = ({ children }) => {
  const [filter, setFilter] = useState('all');

  const isAll = filter === 'all';
  const isAlerts = filter === 'alerts';
  const isMisconfigs = filter === 'misconfigs';

  const handleFilterChange = useCallback((filterType) => {
    setFilter(filterType);
  }, []);

  const shouldShowNode = useCallback((nodeData) => {
    if (isAll) return true;
    if (isAlerts) return nodeData.alerts > 0;
    if (isMisconfigs) return nodeData.misconfigs > 0;
    return true;
  }, [isAll, isAlerts, isMisconfigs]);

  const getFilteredLabel = useCallback((nodeData, hasChildren, isExpanded) => {
    let labelText = nodeData.label;
    if (isAll) {
      labelText += `\n🔺${nodeData.alerts} ⚙️${nodeData.misconfigs}`;
    } else if (isAlerts) {
      labelText += `\n🔺${nodeData.alerts}`;
    } else if (isMisconfigs) {
      labelText += `\n⚙️${nodeData.misconfigs}`;
    }
    if (hasChildren) {
      labelText += `\n${isExpanded ? '➖' : '➕'}`;
    }
    return labelText;
  }, [isAll, isAlerts, isMisconfigs]);

  const value = {
    filter,
    isAll,
    isAlerts,
    isMisconfigs,
    handleFilterChange,
    shouldShowNode,
    getFilteredLabel
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
