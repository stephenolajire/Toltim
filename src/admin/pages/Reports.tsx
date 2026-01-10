import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../constant/api";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Camera,
  Clock,
  Stethoscope,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// API fetch functions
const fetchPatientReports = async (userId: string) => {
  const response = await api.get(`/admin/reports/${userId}/`);
  return response.data;
};

const fetchBookingReport = async (bookingId: string, type: string) => {
  const response = await api.get(`/admin/reports/${bookingId}/${type}/`);
  return response.data;
};

const PatientReports: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("procedure");
  const [viewMode, setViewMode] = useState<"history" | "specific">("history");

  // Fetch full patient history
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["patientReports", user_id],
    queryFn: () => fetchPatientReports(user_id!),
    enabled: !!user_id && viewMode === "history",
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch specific booking report
  const {
    data: bookingData,
    isLoading: bookingLoading,
    error: bookingError,
    refetch: refetchBooking,
  } = useQuery({
    queryKey: ["bookingReport", selectedBooking, selectedType],
    queryFn: () => fetchBookingReport(selectedBooking, selectedType),
    enabled: false, // Manual trigger
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleViewSpecificReport = () => {
    if (selectedBooking && selectedType) {
      setViewMode("specific");
      refetchBooking();
    }
  };

  const handleBackToHistory = () => {
    setViewMode("history");
    setSelectedBooking("");
  };

  const reportTypes = [
    { value: "procedure", label: "Nursing Procedure" },
    { value: "caregiver", label: "Caregiver" },
    { value: "inpatient", label: "Inpatient" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Patients</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Patient Reports</h1>
          <p className="text-gray-600 mt-1">
            View comprehensive medical reports and treatment history
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Report Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* View Mode Toggle */}
            <div className="md:col-span-3">
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode("history")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    viewMode === "history"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Full History
                </button>
                <button
                  onClick={() => setViewMode("specific")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    viewMode === "specific"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Specific Booking
                </button>
              </div>
            </div>

            {/* Specific Booking Filters */}
            {viewMode === "specific" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    value={selectedBooking}
                    onChange={(e) => setSelectedBooking(e.target.value)}
                    placeholder="Enter booking ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    >
                      {reportTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleViewSpecificReport}
                    disabled={!selectedBooking}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    View Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        {viewMode === "history" && (
          <HistoryView
            data={historyData}
            loading={historyLoading}
            error={historyError}
          />
        )}

        {viewMode === "specific" && (
          <SpecificReportView
            data={bookingData}
            loading={bookingLoading}
            error={bookingError}
            onBack={handleBackToHistory}
          />
        )}
      </div>
    </div>
  );
};

// History View Component
const HistoryView: React.FC<{
  data: any;
  loading: boolean;
  error: any;
}> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading patient history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Error Loading Reports</h3>
        </div>
        <p className="text-gray-600">
          {error instanceof Error
            ? error.message
            : "Unable to fetch patient reports. Please try again."}
        </p>
      </div>
    );
  }

  const reports = Array.isArray(data) ? data : [data].filter(Boolean);

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-600">
            This patient doesn't have any medical reports yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Full Medical History ({reports.length} Reports)
      </h2>
      {reports.map((report: any, index: number) => (
        <ReportCard key={report.id || index} report={report} />
      ))}
    </div>
  );
};

// Specific Report View Component
const SpecificReportView: React.FC<{
  data: any;
  loading: boolean;
  error: any;
  onBack: () => void;
}> = ({ data, loading, error, onBack }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Error Loading Report</h3>
        </div>
        <p className="text-gray-600 mb-4">
          {error instanceof Error
            ? error.message
            : "Unable to fetch the report. Please check the booking ID and type."}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to History
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Report Available
          </h3>
          <p className="text-gray-600 mb-4">
            No report found for this booking ID and type combination.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Full History
      </button>
      <ReportCard report={data} detailed />
    </div>
  );
};

// Report Card Component
const ReportCard: React.FC<{ report: any; detailed?: boolean }> = ({
  report,
}) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const displayPhotos = showAllPhotos
    ? report.treatment_photos
    : report.treatment_photos?.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {report.booking_code}
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                {report.report_type}
              </span>
            </div>
            {report.worker_details && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{report.worker_details}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {new Date(report.service_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Treatment Record */}
        {report.treatment_record && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Treatment Record
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap">
                {report.treatment_record}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {report.notes && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Additional Notes
            </h4>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-gray-800 whitespace-pre-wrap">
                {report.notes}
              </p>
            </div>
          </div>
        )}

        {/* Treatment Photos */}
        {report.treatment_photos && report.treatment_photos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Treatment Photos ({report.treatment_photos.length})
              </h4>
              {report.treatment_photos.length > 3 && (
                <button
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAllPhotos ? "Show Less" : "Show All"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayPhotos?.map((photo: any, index: number) => (
                <div
                  key={index}
                  className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={photo.photo_url}
                    alt={`Treatment photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs">
                      Uploaded:{" "}
                      {new Date(photo.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report ID */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Report ID: {report.id}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientReports;
