import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  X,
  Filter,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useNurseApproval,
  useNurseRejection,
  useNurseVerification,
} from "../../constant/GlobalContext";
import { toast } from "react-toastify";
import DocumentModal from "../components/verification/DocumentModal";

// Type definitions based on actual API response
interface Nurse {
  id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialization: string | { id: string; name: string }; // Can be string or object
  institution: string;
  year_of_graduation: number;
  year_of_experience: string;
  workplace: string;
  work_address: string;
  biography: string;
  emergency_contact_details: string;
  status:
    | "pending"
    | "under_review"
    | "documents_missing"
    | "approved"
    | "rejected";
  license_document: string;
  cv_document: string;
  employment_letter: string;
  certificate_document: string;
  id_card: string;
  photo: string;
}

type StatusFilter =
  | "all"
  | "pending"
  | "under_review"
  | "documents_missing"
  | "approved"
  | "rejected";

const getSpecializationName = (
  specialization: string | { id: string; name: string },
): string => {
  if (typeof specialization === "string") {
    return specialization;
  }
  return specialization?.name || "N/A";
};

const PendingNurseVerifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: apiData, isLoading } = useNurseVerification();
  const { mutate: updateKYC, isSuccess: update } = useNurseApproval();
  const { mutate: rejectKYC, isSuccess } = useNurseRejection();

  // Extract nurses array from API response
  const nurses: Nurse[] = apiData?.results || [];
  const totalCount = apiData?.count || 0;

  // Status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "under_review":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "documents_missing":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  // Helper function to get full name
  const getFullName = (nurse: Nurse): string => {
    return `${nurse.first_name} ${nurse.last_name}`.trim();
  };

  // Helper function to count documents
  const getDocumentCount = (nurse: Nurse): number => {
    const docs = [
      nurse.license_document,
      nurse.cv_document,
      nurse.employment_letter,
      nurse.certificate_document,
      nurse.id_card,
      nurse.photo,
    ];
    return docs.filter((doc) => doc && doc.trim() !== "").length;
  };

  // Helper function to format status for display
  const formatStatusForDisplay = (status: string): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Filter nurses based on search term and status
  const filteredNurses = useMemo(() => {
    return nurses.filter((nurse: Nurse) => {
      const fullName = getFullName(nurse);
      const specializationName = getSpecializationName(nurse.specialization);

      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specializationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.license_number.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || nurse.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [nurses, searchTerm, statusFilter]);

  // Action handlers
  const handleView = (nurse: Nurse): void => {
    setSelectedNurse(nurse);
    setIsModalOpen(true);
  };

  const handleVerify = (nurseId: string): void => {
    updateKYC(nurseId);
    update && toast.success("KYC has been approved");
    // Close modal after verification
    closeModal();
  };

  const handleReject = (nurseId: string): void => {
    rejectKYC(nurseId);
    isSuccess && toast.success("KYC has been rejected");
    // Close modal after rejection
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNurse(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div className="text-lg text-gray-600">Loading nurses data...</div>
        </div>
      </div>
    );
  }

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
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="documents_missing">Documents Missing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
              No Pending Nurse Verifications
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              All Nurse verification requests have been processed.
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
                    License #
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
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      {nurse.license_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFullName(nurse)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {nurse.email_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getSpecializationName(nurse.specialization)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {nurse.year_of_experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {nurse.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getDocumentCount(nurse)} docs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(nurse.status)}>
                        {formatStatusForDisplay(nurse.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(nurse)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View documents"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {nurse.status === "pending" && (
                          <button
                            onClick={() => handleVerify(nurse.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Verify nurse"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {nurse.status !== "approved" &&
                          nurse.status !== "rejected" && (
                            <button
                              onClick={() => handleReject(nurse.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Reject application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state for filtered results */}
          {filteredNurses.length === 0 && nurses.length > 0 && (
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
        Showing {filteredNurses.length} of {totalCount} nurses
      </div>

      {/* Document Modal */}
      <DocumentModal
        nurse={selectedNurse}
        isOpen={isModalOpen}
        onClose={closeModal}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    </div>
  );
};

export default PendingNurseVerifications;
