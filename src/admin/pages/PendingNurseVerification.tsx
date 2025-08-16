import React, { useState, useMemo } from "react";
import { Search, Eye, CheckCircle, X, Filter, AlertTriangle } from "lucide-react";

// Type definitions
interface Nurse {
  id: string;
  name: string;
  email: string;
  specialty: string;
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

const PendingNurseVerifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Sample data
  const [nurses] = useState<Nurse[]>([
    {
      id: "NUR001",
      name: "Dr. Sarah Johnson",
      email: "sarahj@email.com",
      specialty: "Pediatric Nursing",
      experience: "5 years",
      documents: 3,
      status: "Pending",
      submitted: "2024-01-15",
    },
    {
      id: "NUR002",
      name: "Nurse Michael Brown",
      email: "michael.b@email.com",
      specialty: "Critical Care",
      experience: "8 years",
      documents: 2,
      status: "Under Review",
      submitted: "2024-01-14",
    },
    {
      id: "NUR003",
      name: "Nurse Grace Ade",
      email: "grace.a@email.com",
      specialty: "General Nursing",
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

  // Filter nurses based on search term and status
  const filteredNurses = useMemo(() => {
    return nurses.filter((nurse) => {
      const matchesSearch =
        nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || nurse.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [nurses, searchTerm, statusFilter]);

  // Action handlers
  const handleView = (nurseId: string): void => {
    console.log("View nurse:", nurseId);
  };

  const handleVerify = (nurseId: string): void => {
    console.log("Verify nurse:", nurseId);
  };

  const handleReject = (nurseId: string): void => {
    console.log("Reject nurse:", nurseId);
  };

  return (
    <div className="bg-white h-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Pending Nurse Verifications
        </h1>
        <p className="text-gray-600">
          Review and verify registered nurses awaiting approval
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nurses..."
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

      {nurses.length === 0 ? (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
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
              {filteredNurses.map((nurse) => (
                <tr key={nurse.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {nurse.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {nurse.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nurse.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nurse.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nurse.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nurse.documents} docs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(nurse.status)}>
                      {nurse.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nurse.submitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(nurse.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleVerify(nurse.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Verify nurse"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(nurse.id)}
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
        {filteredNurses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No nurses found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
      )}

      {/* Results summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredNurses.length} of {nurses.length} nurses
      </div>
    </div>
  );
};

export default PendingNurseVerifications;
