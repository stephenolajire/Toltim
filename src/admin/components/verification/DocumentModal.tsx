import React from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Image,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

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

interface DocumentModalProps {
  nurse: Nurse | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (nurseId: string) => void;
  onReject: (nurseId: string) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  nurse,
  isOpen,
  onClose,
  onVerify,
  onReject,
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

  const getSpecializationName = (
    specialization: string | { id: string; name: string },
  ): string => {
    if (typeof specialization === "string") {
      return specialization;
    }
    return specialization?.name || "N/A";
  };

  // Check if verification actions should be shown
  const canVerify = nurse.status === "pending";
  const canReject = nurse.status !== "approved" && nurse.status !== "rejected";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {nurse.first_name} {nurse.last_name}
            </h2>
            <p className="text-blue-100 mt-1">
              License: {nurse.license_number} |{" "}
              {getSpecializationName(nurse.specialization)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Nurse Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Personal & Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Personal Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Full Name:</span>
                    <span className="text-gray-900 font-medium text-sm">
                      {nurse.first_name} {nurse.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Email:</span>
                    <span className="text-gray-900 font-medium text-sm truncate ml-2">
                      {nurse.email_address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Emergency Contact:
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {nurse.emergency_contact_details || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Professional Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      License Number:
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {nurse.license_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Specialization:
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {getSpecializationName(nurse.specialization)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Experience:</span>
                    <span className="text-gray-900 font-medium text-sm">
                      {nurse.year_of_experience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Education
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Institution:</span>
                    <span className="text-gray-900 font-medium text-sm text-right ml-2">
                      {nurse.institution}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">
                      Graduation Year:
                    </span>
                    <span className="text-gray-900 font-medium text-sm">
                      {nurse.year_of_graduation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Current Employment
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Workplace:</span>
                    <span className="text-gray-900 font-medium text-sm text-right ml-2">
                      {nurse.workplace || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Work Address:</span>
                    <span className="text-gray-900 font-medium text-sm text-right ml-2">
                      {nurse.work_address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            {nurse.biography && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">
                  Biography
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {nurse.biography}
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Current Status:
              </span>
              <span className={getStatusBadge(nurse.status)}>
                {formatStatusForDisplay(nurse.status)}
              </span>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Uploaded Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Documents Available
                </h4>
                <p className="text-gray-600">
                  No documents have been uploaded for this nurse yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc.type)}
                        <h4 className="font-medium text-gray-900 text-sm">
                          {doc.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenInNewTab(doc.url)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <a
                          href={doc.url}
                          download={getFileName(doc.url, doc.type)}
                          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded"
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
                                "hidden",
                              );
                            }}
                          />
                          <div className="hidden">
                            <Image className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Photo Preview
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">Click to view</p>
                        </div>
                      )}
                    </div>

                    {/* Document Actions */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleOpenInNewTab(doc.url)}
                        className="flex-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(
                            doc.url,
                            getFileName(doc.url, doc.type),
                          )
                        }
                        className="flex-1 bg-green-50 text-green-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
          <div className="flex gap-3">
            {canVerify && (
              <button
                onClick={() => onVerify(nurse.id)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <CheckCircle className="w-4 h-4" />
                Approve Verification
              </button>
            )}
            {canReject && (
              <button
                onClick={() => onReject(nurse.id)}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                <XCircle className="w-4 h-4" />
                Reject Application
              </button>
            )}
          </div>
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

// Helper function to format status for display
const formatStatusForDisplay = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function for status badge
const getStatusBadge = (status: string): string => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
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
export default DocumentModal;
