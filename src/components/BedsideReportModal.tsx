import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  FileText,
  User,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import api from "../constant/api";

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

interface BedsideReportDetails {
  id: string;
  service_date: string;
  booking_code: string;
  report_type: string;
  treatment_photos?: TreatmentPhoto[];
  notes: string;
  treatment_record: TreatmentRecord | string | null;
  worker_details: WorkerDetails | string | null;
}

interface ReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BedsideReportDetails[];
}

interface BedsideReportModalProps {
  bookingId: string;
  bookingType: string;
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
}

const BedsideReportModal: React.FC<BedsideReportModalProps> = ({
  bookingId,
  bookingType,
  reportId,
  isOpen,
  onClose,
}) => {
  // Fetch the specific report by finding it in the results
  const {
    data: reportResponse,
    isLoading,
    isError,
  } = useQuery<ReportResponse>({
    queryKey: ["bedside-report-detail", bookingId, bookingType, reportId],
    queryFn: async () => {
      const res = await api.get(`admin/reports/${bookingId}/${bookingType}/`);
      console.log("Fetched bedside report details:", res.data);
      return res.data;
    },
    enabled: isOpen && !!bookingId && !!bookingType && !!reportId,
  });

  // Find the specific report from the results
  const reportDetails = reportResponse?.results?.find(
    (report) => report.id === reportId,
  );

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

  const renderTreatmentRecord = (record: TreatmentRecord | string | null) => {
    if (!record) {
      return (
        <p className="text-gray-500 italic">No treatment record available</p>
      );
    }

    if (typeof record === "string") {
      return <p className="text-gray-700 whitespace-pre-wrap">{record}</p>;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-green-200">
            <span className="text-sm text-green-600 font-medium">Status:</span>
            <p className="text-gray-900 capitalize mt-1">{record.status}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-green-200">
            <span className="text-sm text-green-600 font-medium">CHW:</span>
            <p className="text-gray-900 mt-1">{record.nurse}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {record.blood_pressure && (
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <span className="text-sm text-gray-600">Blood Pressure:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.blood_pressure}
              </p>
            </div>
          )}
          {record.temperature && (
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <span className="text-sm text-gray-600">Temperature:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.temperature}
              </p>
            </div>
          )}
          {record.pulse_rate && (
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <span className="text-sm text-gray-600">Pulse Rate:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.pulse_rate}
              </p>
            </div>
          )}
          {record.blood_sugar && (
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <span className="text-sm text-gray-600">Blood Sugar:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.blood_sugar}
              </p>
            </div>
          )}
          {record.oxygen_saturation && (
            <div className="bg-white p-3 rounded-lg border border-green-100">
              <span className="text-sm text-gray-600">Oxygen Saturation:</span>
              <p className="text-gray-900 font-medium mt-1">
                {record.oxygen_saturation}
              </p>
            </div>
          )}
        </div>

        {record.patient_condition && (
          <div className="bg-white p-3 rounded-lg border border-green-100">
            <span className="text-sm text-gray-600 block mb-2">
              Patient Condition:
            </span>
            <p className="text-gray-900">{record.patient_condition}</p>
          </div>
        )}

        {record.medications_administered && (
          <div className="bg-white p-3 rounded-lg border border-green-100">
            <span className="text-sm text-gray-600 block mb-2">
              Medications Administered:
            </span>
            <p className="text-gray-900">{record.medications_administered}</p>
          </div>
        )}

        {record.next_steps && (
          <div className="bg-white p-3 rounded-lg border border-green-100">
            <span className="text-sm text-gray-600 block mb-2">
              Next Steps:
            </span>
            <p className="text-gray-900">{record.next_steps}</p>
          </div>
        )}
      </div>
    );
  };

  const renderWorkerDetails = (worker: WorkerDetails | string | null) => {
    if (!worker) {
      return (
        <p className="text-gray-500 italic">No worker details available</p>
      );
    }

    if (typeof worker === "string") {
      return <p className="text-gray-700 whitespace-pre-wrap">{worker}</p>;
    }

    return (
      <div className="flex items-start gap-4">
        {worker.profile_picture && (
          <img
            src={worker.profile_picture}
            alt={worker.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
          />
        )}
        <div className="flex-1">
          <p className="text-gray-900 font-medium text-lg">
            {worker.full_name}
          </p>
          <p className="text-gray-600 capitalize text-sm mt-1">
            Role: {worker.role}
          </p>
          <p className="text-gray-500 text-xs mt-1 font-mono">
            ID: {worker.id}
          </p>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-5xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-xl shadow-2xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Bedside Care Service Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {reportDetails?.booking_code || `Booking #${bookingId}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-500">Loading report details...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <AlertCircle className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  Failed to load report details
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Please try again later
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !reportDetails ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  Report not found
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  The requested report could not be found
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-900">
                      Report Information
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Report ID:</span>
                      <span className="text-sm text-gray-900 font-mono">
                        {reportDetails.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Report Type:
                      </span>
                      <span className="text-sm text-gray-900 capitalize">
                        {reportDetails.report_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Booking Code:
                      </span>
                      <span className="text-sm text-gray-900">
                        {reportDetails.booking_code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">
                      Service Details
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">
                        Service Date:
                      </span>
                      <span className="text-sm text-green-900 font-medium">
                        {formatDate(reportDetails.service_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker Details */}
              {reportDetails.worker_details && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">
                      Community Health Worker Details
                    </h4>
                  </div>
                  {renderWorkerDetails(reportDetails.worker_details)}
                </div>
              )}

              {/* Treatment Record */}
              {reportDetails.treatment_record && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">
                      Care Record
                    </h4>
                  </div>
                  {renderTreatmentRecord(reportDetails.treatment_record)}
                </div>
              )}

              {/* Notes */}
              {reportDetails.notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">
                      Additional Notes
                    </h4>
                  </div>
                  <p className="text-sm text-yellow-800 whitespace-pre-wrap leading-relaxed">
                    {reportDetails.notes}
                  </p>
                </div>
              )}

              {/* Treatment Photos */}
              {reportDetails.treatment_photos &&
                reportDetails.treatment_photos.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">
                        Service Photos ({reportDetails.treatment_photos.length})
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {reportDetails.treatment_photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
                        >
                          <img
                            src={photo.photo_url}
                            alt={`Service photo ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3 bg-white border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Uploaded: {formatDateTime(photo.uploaded_at)}
                            </p>
                          </div>
                          {/* Enlarge on hover overlay */}
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
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
            {reportDetails && (
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
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

export default BedsideReportModal;
