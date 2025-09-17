import React, { useState, useMemo } from "react";
import { Search, Download, FileText, Eye, Calendar, User } from "lucide-react";


// Type definitions
interface VerificationRecord {
  id: string;
  name: string;
  email: string;
  type: "Doctor" | "Nurse" | "Pharmacist" | "Therapist";
  specialty: string;
  status: "Approved" | "Rejected";
  submittedDate: string;
  completedDate: string;
  reviewedBy: string;
  reason?: string;
}

type StatusFilter = "all" | "Approved" | "Rejected";
type TypeFilter = "all" | "Doctor" | "Nurse" | "Chw" ;
// type DateFilter = "all" | "7days" | "30days" | "90days" | "1year";

const VerificationHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
//   const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  // Sample data - empty to show the empty state
  const [verificationHistory] = useState<VerificationRecord[]>([]);

  // Status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  };

  // Type badge styling
//   const getTypeBadge = (type: string): string => {
//     const baseClasses =
//       "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
//     return baseClasses;
//   };

  // Filter verification records
  const filteredRecords = useMemo(() => {
    return verificationHistory.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter;
      const matchesType = typeFilter === "all" || record.type === typeFilter;

      // Date filtering logic would go here
      const matchesDate = true; // Simplified for now

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [verificationHistory, searchTerm, statusFilter, typeFilter]);

  // Action handlers
  const handleView = (recordId: string): void => {
    console.log("View record:", recordId);
  };

  const handleExport = (): void => {
    console.log("Export verification history");
    // Implementation would generate and download CSV/PDF
  };

  return (
    <div className="h-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Verification History
        </h1>
        <p className="text-gray-600">
          View all completed verification requests and their outcomes
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search verification history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Therapist">Therapist</option>
          </select>
        </div>
{/* 
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Filter by...</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div> */}

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Conditional rendering: Empty state or Table */}
      {verificationHistory.length === 0 ? (
        // Empty State
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="mb-4">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verification History
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              Historical verification data will appear here.
            </p>
          </div>
        </div>
      ) : (
        // Table (will be shown when there are records)
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <span className={getTypeBadge(record.type)}>
                        {record.type}
                      </span> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(record.status)}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {record.submittedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {record.completedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        {record.reviewedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button
                        onClick={() => handleView(record.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty filtered results */}
          {filteredRecords.length === 0 && verificationHistory.length > 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No records found</div>
              <div className="text-sm text-gray-400">
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results summary - only show if there are records */}
      {verificationHistory.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredRecords.length} of {verificationHistory.length}{" "}
            records
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
              <span>
                Approved:{" "}
                {
                  verificationHistory.filter((r) => r.status === "Approved")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
              <span>
                Rejected:{" "}
                {
                  verificationHistory.filter((r) => r.status === "Rejected")
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;
