import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Heart,
} from "lucide-react";
import api from "../../constant/api";
import CaregiverReportModal from "../../nurse/components/CaregiverReportModal";

interface TreatmentPhoto {
  photo_url: string;
  uploaded_at: string;
}

interface CaregiverReportDetails {
  id: string;
  service_date: string;
  booking_code: string;
  report_type: string;
  treatment_photos: TreatmentPhoto[];
  notes: string;
  treatment_record: string;
  worker_details: string;
}

interface ReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CaregiverReportDetails[];
}

const CaregiverReportPage: React.FC = () => {
  const { bookingId } = useParams<{
    bookingId: string;
    // bookingType: string;
  }>();

  const bookingType = 'caregiving'
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetch all reports for this booking
  const {
    data: reportResponse,
    isLoading,
    isError,
  } = useQuery<ReportResponse>({
    queryKey: ["caregiver-reports-list", bookingId, bookingType, currentPage],
    queryFn: async () => {
      const res = await api.get(
        `admin/reports/${bookingId}/${bookingType}/?page=${currentPage}`,
      );
      console.log("Fetched caregiver reports:", res.data);
      return res.data;
    },
    enabled: !!bookingId && !!bookingType,
  });

  const reports = reportResponse?.results || [];
  const totalPages = reportResponse?.count
    ? Math.ceil(reportResponse.count / 10)
    : 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const handleRowClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setSelectedReportId(null);
  };

//   const hasPhotos = (report: CaregiverReportDetails) => {
//     return report.treatment_photos && report.treatment_photos.length > 0;
//   };

  const hasCareRecord = (report: CaregiverReportDetails) => {
    return !!report.treatment_record;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Booking Details</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Caregiving Service Reports
                </h1>
                <p className="text-gray-600 mt-1">
                  {reports[0]?.booking_code || `Booking #${bookingId}`} •{" "}
                  {reportResponse?.count || 0} report
                  {reportResponse?.count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-500">Loading reports...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <AlertCircle className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Failed to load reports
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Please try again later
              </p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No reports available
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Reports will appear here once the service begins
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Caregiver
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Care Record
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Photos
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report, index) => (
                      <tr
                        key={report.id}
                        onClick={() => handleRowClick(report.id)}
                        className="hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-700">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(report.service_date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {report.worker_details || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasCareRecord(report) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Recorded
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              No record
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {report.treatment_photos?.length || 0} photo
                            {report.treatment_photos?.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {report.notes || "No notes"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {reportResponse && reportResponse.count > 10 && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} (
                    {reportResponse.count} total reports)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!reportResponse.previous}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        reportResponse.previous
                          ? "bg-purple-600 text-white hover:bg-purple-700"
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
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReportId && (
        <CaregiverReportModal
          bookingId={bookingId!}
          bookingType={bookingType!}
          reportId={selectedReportId}
          isOpen={isReportModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CaregiverReportPage;
