// src/components/tasks/TaskFilters.jsx
import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/utils/constants';
import Button from '../common/Button';

const TaskFilters = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const { data: employees } = useEmployees({ limit: 100 });
  
  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };
  
  const handleClear = () => {
    const clearedFilters = { status: '', priority: '', assignedTo: '' };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setIsOpen(false);
  };
  
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="relative">
      <Button
        variant="outline"
        leftIcon={<Filter className="h-4 w-4" />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-primary-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={localFilters.priority}
                onChange={(e) => setLocalFilters({ ...localFilters, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Assigned To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                value={localFilters.assignedTo}
                onChange={(e) => setLocalFilters({ ...localFilters, assignedTo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                variant="primary"
                onClick={handleApply}
                className="flex-1"
              >
                Apply
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskFilters;
