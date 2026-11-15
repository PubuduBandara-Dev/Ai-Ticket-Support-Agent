import React from 'react';
import { Search, Filter } from 'lucide-react';

interface TicketFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  statuses: string[];
}

export const TicketFilter: React.FC<TicketFilterProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statuses,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by subject or description..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700 shadow-sm transition-all"
        >
          <option value="ALL">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
