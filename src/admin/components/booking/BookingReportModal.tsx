import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../../constant/api";

interface TreatmentPhoto {
  photo_url: string;
  uploaded_at: string;
}

interface TreatmentRecord {
  status: string;
  nurse: string;
  blood_pressure: string | null;
  temperature: string | null;
  pulse_rate: string | null;
  blood_sugar: string | null;
  oxygen_saturation: string | null;
  patient_condition: string | null;
  medications_administered: string | null;
  next_steps: string | null;
}

interface WorkerDetails {
  id: string;
  full_name: string;
  role: string;
  profile_picture: string;
}

interface ReportDetails {
  id: string;
  service_date: string;
  booking_code: string;
  report_type: string;
  treatment_photos?: TreatmentPhoto[];
  notes: string;
  treatment_record: TreatmentRecord | string;
  worker_details: WorkerDetails | string;
}

interface ReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReportDetails[];
}

interface BookingReportModalProps {
  bookingId: number;
  bookingType: string;
  isOpen: boolean;
  onClose: () => void;
}

const BookingReportModal: React.FC<BookingReportModalProps> = ({
  bookingId,
  bookingType,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: reportResponse,
    isLoading,
    isError,
  } = useQuery<ReportResponse>({
    queryKey: ["booking-report", bookingId, bookingType, currentPage],
    queryFn: async () => {
      const res = await api.get(
        `admin/reports/${bookingId}/${bookingType}/?page=${currentPage}`
      );
      return res.data;
    },
    enabled: isOpen && !!bookingId && !!bookingType,
  });

  const reportDetails = reportResponse?.results?.[0];
  const totalPages = reportResponse?.count
    ? Math.ceil(reportResponse.count / 1)
    : 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePreviousPage = () => {
    if (reportResponse?.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (reportResponse?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderTreatmentRecord = (record: TreatmentRecord | string) => {
    if (typeof record === "string") {
      return <p className="text-gray-700 whitespace-pre-wrap">{record}</p>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <span className="text-sm text-purple-600 font-medium">Status:</span>
            <p className="text-gray-900 capitalize mt-1">{record.status}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-purple-200">
            <span className="text-sm text-purple-600 font-medium">Nurse:</span>
            <p className="text-gray-900 mt-1">{record.nurse}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {record.blood_pressure && (
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <span className="text-sm text-gray-600">Blood Pressure:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.blood_pressure}
              </p>
            </div>
          )}
          {record.temperature && (
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <span className="text-sm text-gray-600">Temperature:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.temperature}
              </p>
            </div>
          )}
          {record.pulse_rate && (
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <span className="text-sm text-gray-600">Pulse Rate:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.pulse_rate}
              </p>
            </div>
          )}
          {record.blood_sugar && (
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <span className="text-sm text-gray-600">Blood Sugar:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.blood_sugar}
              </p>
            </div>
          )}
          {record.oxygen_saturation && (
            <div className="bg-white p-3 rounded-lg border border-purple-100">
              <span className="text-sm text-gray-600">Oxygen Saturation:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.oxygen_saturation}
              </p>
            </div>
          )}
        </div>

        {record.patient_condition && (
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <span className="text-sm text-gray-600 block mb-2">
              Patient Condition:
            </span>
            <p className="text-gray-900">{record.patient_condition}</p>
          </div>
        )}

        {record.medications_administered && (
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <span className="text-sm text-gray-600 block mb-2">
              Medications Administered:
            </span>
            <p className="text-gray-900">{record.medications_administered}</p>
          </div>
        )}

        {record.next_steps && (
          <div className="bg-white p-3 rounded-lg border border-purple-100">
            <span className="text-sm text-gray-600 block mb-2">
              Next Steps:
            </span>
            <p className="text-gray-900">{record.next_steps}</p>
          </div>
        )}
      </div>
    );
  };

  const renderWorkerDetails = (worker: WorkerDetails | string) => {
    if (typeof worker === "string") {
      return <p className="text-gray-700 whitespace-pre-wrap">{worker}</p>;
    }

    return (
      <div className="flex items-start gap-4">
        {worker.profile_picture && (
          <img
            src={worker.profile_picture}
            alt={worker.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-200 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-medium text-lg truncate">
            {worker.full_name}
          </p>
          <p className="text-gray-600 capitalize text-sm mt-1">
            Role: {worker.role}
          </p>
          <p className="text-gray-500 text-xs mt-1 font-mono break-all">
            ID: {worker.id}
          </p>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    // ── Outer backdrop ──────────────────────────────────────────────────────
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

        {/* Backdrop click-to-close — pointer-events-none prevents it from
            blocking scroll events on mobile */}
        <div
          className="fixed inset-0 transition-opacity pointer-events-none"
          aria-hidden="true"
        />

        {/* Invisible block used by browsers to vertically centre on sm+ */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* ── Modal panel ─────────────────────────────────────────────────── */}
        <div className="inline-block w-full max-w-5xl px-4 pt-5 pb-4 overflow-y-auto text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6 max-h-[90vh]">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Booking Report
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {reportDetails?.booking_code || `Booking #${bookingId}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                <p className="mt-4 text-gray-500">Loading report details...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600">Failed to load report details</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : reportDetails ? (
            <div className="space-y-6">

              {/* Report Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Report Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2 flex-wrap">
                      <span className="text-gray-600">Report ID:</span>
                      <span className="text-gray-900 font-mono text-sm break-all">
                        {reportDetails.id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 flex-wrap">
                      <span className="text-gray-600">Report Type:</span>
                      <span className="text-gray-900 capitalize">
                        {reportDetails.report_type}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 flex-wrap">
                      <span className="text-gray-600">Booking Code:</span>
                      <span className="text-gray-900">
                        {reportDetails.booking_code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Service Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2 flex-wrap">
                      <span className="text-gray-600">Service Date:</span>
                      <span className="text-gray-900">
                        {formatDate(reportDetails.service_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Details */}
              {reportDetails.worker_details && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Worker Details
                  </h4>
                  {renderWorkerDetails(reportDetails.worker_details)}
                </div>
              )}

              {/* Treatment Record */}
              {reportDetails.treatment_record && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Treatment Record
                  </h4>
                  {renderTreatmentRecord(reportDetails.treatment_record)}
                </div>
              )}

              {/* Notes */}
              {reportDetails.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {reportDetails.notes}
                  </p>
                </div>
              )}

              {/* Treatment Photos */}
              {reportDetails.treatment_photos &&
                reportDetails.treatment_photos.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Treatment Photos ({reportDetails.treatment_photos.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {reportDetails.treatment_photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <img
                            src={photo.photo_url}
                            alt={`Treatment photo ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-2 bg-white">
                            <p className="text-xs text-gray-500">
                              Uploaded: {formatDateTime(photo.uploaded_at)}
                            </p>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <a
                              href={photo.photo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-100 transition-colors"
                            >
                              View Full Size
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Pagination */}
              {reportResponse && reportResponse.count > 1 && (
                <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-3">
                  <div className="text-sm text-gray-600">
                    Showing report {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!reportResponse.previous}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        reportResponse.previous
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!reportResponse.next}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        reportResponse.next
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            {reportDetails && (
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Print Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReportModal;
