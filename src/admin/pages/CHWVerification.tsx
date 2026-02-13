import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  X,
  Filter,
  AlertTriangle,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { useCHWVerification } from "../../constant/GlobalContext";
import Error from "../../components/Error";
import Loading from "../../components/common/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../constant/api";
import { toast } from "react-toastify";

// Type definitions
interface CHWDocument {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  institution: string;
  year_of_graduation: number;
  year_of_experience: string;
  biography: string;
  emergency_contact_details: string;
  utility_bill: string;
  certificate_document: string;
  id_card: string;
  photo: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "under_review"
    | "documents_missing";
}

type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "under_review"
  | "documents_missing";

interface DocumentModalProps {
  chw: CHWDocument | null;
  onClose: () => void;
  onApprove: (chwId: string) => void;
  onReject: (chwId: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  chw,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}) => {
  if (!chw) return null;

  const documents = [
    { name: "Utility Bill", url: chw.utility_bill, icon: FileText },
    { name: "Certificate", url: chw.certificate_document, icon: FileText },
    { name: "ID Card", url: chw.id_card, icon: FileText },
    { name: "Photo", url: chw.photo, icon: FileText },
  ];

  const handleDocumentClick = (url: string) => {
    if (url && url.trim() !== "") {
      window.open(url, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  const handleApprove = () => {
    if (
      window.confirm(
        `Are you sure you want to approve ${chw.first_name} ${chw.last_name}?`,
      )
    ) {
      onApprove(chw.id);
    }
  };

  const handleReject = () => {
    if (
      window.confirm(
        `Are you sure you want to reject ${chw.first_name} ${chw.last_name}?`,
      )
    ) {
      onReject(chw.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {chw.first_name} {chw.last_name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{chw.email_address}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {/* CHW Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Institution</p>
                <p className="text-sm font-medium text-gray-900">
                  {chw.institution}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year of Graduation</p>
                <p className="text-sm font-medium text-gray-900">
                  {chw.year_of_graduation}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Years of Experience</p>
                <p className="text-sm font-medium text-gray-900">
                  {chw.year_of_experience}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Contact</p>
                <p className="text-sm font-medium text-gray-900">
                  {chw.emergency_contact_details}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Biography</p>
                <p className="text-sm font-medium text-gray-900">
                  {chw.biography}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <button
                  key={index}
                  onClick={() => handleDocumentClick(doc.url)}
                  disabled={!doc.url || doc.url.trim() === ""}
                  className={`flex items-center gap-3 p-4 border border-gray-200 rounded-lg transition-all ${
                    doc.url && doc.url.trim() !== ""
                      ? "hover:bg-gray-50 hover:border-blue-500 cursor-pointer"
                      : "opacity-50 cursor-not-allowed bg-gray-50"
                  }`}
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <doc.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.url && doc.url.trim() !== ""
                        ? "Click to view/download"
                        : "Not uploaded"}
                    </p>
                  </div>
                  {doc.url && doc.url.trim() !== "" && (
                    <Download className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={isRejecting || isApproving}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Reject
                </>
              )}
            </button>

            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PendingCHWVerifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedCHW, setSelectedCHW] = useState<CHWDocument | null>(null);

  const { data: chwData, isLoading, error } = useCHWVerification();
  const queryClient = useQueryClient();

  const chws: CHWDocument[] = chwData?.results || [];

  console.log(chws)

  // Mutation for approving CHW
  const approveMutation = useMutation({
    mutationFn: async (chwId: string) => {
      const response = await api.patch(`user/chw/verification/${chwId}/`, {
        status: "approved",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useCHWVerification"] });
      toast.success("CHW approved successfully!");
      setSelectedCHW(null); // Close modal after success
    },
    onError: (error: any) => {
      console.error("Error approving CHW:", error);
      toast.error(error?.response?.data?.message || "Failed to approve CHW");
    },
  });

  // Mutation for rejecting CHW
  const rejectMutation = useMutation({
    mutationFn: async (chwId: string) => {
      const response = await api.patch(`user/chw/verification/${chwId}/`, {
        status: "rejected",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useCHWVerification"] });
      toast.success("CHW rejected successfully!");
      setSelectedCHW(null); // Close modal after success
    },
    onError: (error: any) => {
      console.error("Error rejecting CHW:", error);
      toast.error(error?.response?.data?.message || "Failed to reject CHW");
    },
  });

  // Status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
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

  const formatStatus = (status: string): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Filter CHWs based on search term and status
  const filteredCHWs = useMemo(() => {
    return chws.filter((chw) => {
      const fullName = `${chw.first_name} ${chw.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        chw.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chw.institution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || chw.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [chws, searchTerm, statusFilter]);

  // Now it's safe to do early returns
  if (error) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  // Action handlers
  const handleView = (chw: CHWDocument): void => {
    setSelectedCHW(chw);
  };

  const handleApprove = (chwId: string): void => {
    approveMutation.mutate(chwId);
  };

  const handleReject = (chwId: string): void => {
    rejectMutation.mutate(chwId);
  };

  // Count documents for a CHW
  const countDocuments = (chw: CHWDocument): number => {
    const docs = [
      chw.utility_bill,
      chw.certificate_document,
      chw.id_card,
      chw.photo,
    ];
    return docs.filter((doc) => doc && doc.trim() !== "").length;
  };

  return (
    <div className="bg-white h-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          CHW Verifications
        </h1>
        <p className="text-gray-600">
          Review and verify registered CHWs awaiting approval
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search CHWs..."
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="documents_missing">Documents Missing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
              No CHW Verifications
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              There are no CHW verification requests at this time.
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
                    Institution
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCHWs.map((chw) => (
                  <tr key={chw.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {chw.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {chw.first_name} {chw.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {chw.email_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {chw.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {chw.year_of_experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {countDocuments(chw)}/4 docs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(chw.status)}>
                        {formatStatus(chw.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button
                        onClick={() => handleView(chw)}
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

          {/* Empty state for filtered results */}
          {filteredCHWs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No CHWs found</div>
              <div className="text-sm text-gray-400">
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredCHWs.length} of {chws.length} CHWs
      </div>

      {/* Document Modal */}
      {selectedCHW && (
        <DocumentModal
          chw={selectedCHW}
          onClose={() => setSelectedCHW(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isApproving={approveMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      )}
    </div>
  );
};

export default PendingCHWVerifications;
