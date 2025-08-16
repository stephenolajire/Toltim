import React, { useState, useMemo } from "react";
import { Search, Eye, CheckCircle, X, Filter, AlertTriangle } from "lucide-react";

// Type definitions
interface chw {
  id: string;
  name: string;
  email: string;
  //   specialty: string;
  experience: string;
  documents: number;
  status:
    | "Pending"
    | "Under Review"
    | "Documents Missing"
    | "Approved"
    | "Rejected";
  submitted: string;
}

type StatusFilter =
  | "all"
  | "Pending"
  | "Under Review"
  | "Documents Missing"
  | "Approved"
  | "Rejected";

const PendingCHWVerifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Sample data
  const [chws] = useState<chw[]>([
    {
      id: "CHW001",
      name: "Dr. Sarah Johnson",
      email: "sarahj@email.com",
      //   specialty: "Pediatric chwsing",
      experience: "5 years",
      documents: 3,
      status: "Pending",
      submitted: "2024-01-15",
    },
    {
      id: "CHW002",
      name: "chw Michael Brown",
      email: "michael.b@email.com",
      //   specialty: "Critical Care",
      experience: "8 years",
      documents: 2,
      status: "Under Review",
      submitted: "2024-01-14",
    },
    {
      id: "CHW003",
      name: "chw Grace Ade",
      email: "grace.a@email.com",
      //   specialty: "General chwsing",
      experience: "3 years",
      documents: 2,
      status: "Documents Missing",
      submitted: "2024-01-14",
    },
  ]);

  // Status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Under Review":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Documents Missing":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "Approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  // Filter chws based on search term and status
  const filteredchws = useMemo(() => {
    return chws.filter((chw) => {
      const matchesSearch =
        chw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chw.email.toLowerCase().includes(searchTerm.toLowerCase());
      // chw.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || chw.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [chws, searchTerm, statusFilter]);

  // Action handlers
  const handleView = (chwId: string): void => {
    console.log("View chw:", chwId);
  };

  const handleVerify = (chwId: string): void => {
    console.log("Verify chw:", chwId);
  };

  const handleReject = (chwId: string): void => {
    console.log("Reject chw:", chwId);
  };

  return (
    <div className="bg-white h-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Pending CHW Verifications
        </h1>
        <p className="text-gray-600">
          Review and verify registered chws awaiting approval
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chws..."
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
            <option value="all">Filter by status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Documents Missing">Documents Missing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {chws.length === 0 ? (
        // Empty State
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="mb-4">
              <AlertTriangle className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Pending Doctor Verifications
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              All doctor verification requests have been processed.
            </p>
          </div>
        </div>
      ) : (
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
                  Email
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredchws.map((chw) => (
                <tr key={chw.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {chw.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {chw.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {chw.email}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {chw.specialty}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {chw.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {chw.documents} docs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(chw.status)}>
                      {chw.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {chw.submitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(chw.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleVerify(chw.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Verify chw"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(chw.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Reject application"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredchws.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No chws found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
      )}

      <div></div>

      {/* Results summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredchws.length} of {chws.length} chws
      </div>
    </div>
  );
};

export default PendingCHWVerifications;
