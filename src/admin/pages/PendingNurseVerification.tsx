import React, { useState, useMemo } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  X,
  Filter,
  AlertTriangle,
  Loader2,
  Download,
  FileText,
  Image,
  ExternalLink,
} from "lucide-react";
import { useNurseApproval, useNurseRejection, useNurseVerification} from "../../constant/GlobalContext";
import { toast } from "react-toastify";

// Type definitions based on actual API response
interface Nurse {
  id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  license_number: string;
  specialization: string;
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

interface DocumentModalProps {
  nurse: Nurse | null;
  isOpen: boolean;
  onClose: () => void;
}

type StatusFilter =
  | "all"
  | "pending"
  | "under_review"
  | "documents_missing"
  | "approved"
  | "rejected";

// Document Modal Component
const DocumentModal: React.FC<DocumentModalProps> = ({
  nurse,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !nurse) return null;

  const documents = [
    { name: "License Document", url: nurse.license_document, type: "license" },
    { name: "CV Document", url: nurse.cv_document, type: "cv" },
    {
      name: "Employment Letter",
      url: nurse.employment_letter,
      type: "employment",
    },
    {
      name: "Certificate Document",
      url: nurse.certificate_document,
      type: "certificate",
    },
    { name: "ID Card", url: nurse.id_card, type: "id" },
    { name: "Photo", url: nurse.photo, type: "photo" },
  ].filter((doc) => doc.url && doc.url.trim() !== "");

  const getFileIcon = (type: string) => {
    if (type === "photo") {
      return <Image className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getFileName = (url: string, type: string) => {
    if (!url) return `${type}.pdf`;
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1] || `${type}.pdf`;
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Documents - {nurse.first_name} {nurse.last_name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              License: {nurse.license_number} | {nurse.specialization}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Documents Available
              </h3>
              <p className="text-gray-600">
                No documents have been uploaded for this nurse yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.type)}
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenInNewTab(doc.url)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <a
                        href={doc.url}
                        download={getFileName(doc.url, doc.type)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded"
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div
                    className="bg-gray-50 rounded border-2 border-dashed border-gray-200 p-4 cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => handleOpenInNewTab(doc.url)}
                  >
                    {doc.type === "photo" ? (
                      <div className="text-center">
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="max-w-full h-32 object-cover rounded mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                        <div className="hidden">
                          <Image className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Photo Preview</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to view document
                        </p>
                        {/* <p className="text-xs text-gray-500 mt-1">
                          {getFileName(doc.url, doc.type)}
                        </p> */}
                      </div>
                    )}
                  </div>

                  {/* Document Actions */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleOpenInNewTab(doc.url)}
                      className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(doc.url, getFileName(doc.url, doc.type))
                      }
                      className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PendingNurseVerifications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: apiData, isLoading } = useNurseVerification();
  const {mutate: updateKYC, isSuccess:update} = useNurseApproval()
  const {mutate: rejectKYC, isSuccess} = useNurseRejection()

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
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nurse.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    updateKYC(nurseId)
    update && (
      toast.success("KYC has been approved")
    )
  };

  const handleReject = (nurseId: string): void => {
    // useNurseRejection(nurseId)
    rejectKYC(nurseId)
    isSuccess && (
      toast.success("KYC has been rejected")
    )
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
                      {nurse.specialization}
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
      />
    </div>
  );
};

export default PendingNurseVerifications;
