import React from "react";

interface FilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full h-auto">
      <div className="col-span-2 md:col-span-3">
        <input
          type="search"
          placeholder="Enter nurse email or patient name"
          className="w-full border border-gray-200 px-3 py-2 text-gray-500 focus:border-black/50 rounded-md"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <select
          className="w-full border border-gray-200 px-3 py-2 rounded-md"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
