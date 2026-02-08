import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, Calendar, User, FileText } from "lucide-react";
import api from "../../constant/api";
import BookingReportModal from "../components/booking/BookingReportModal";

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

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams<{
    bookingId: string;
    // bookingType: string;
  }>();

  const bookingType = 'procedure'
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all reports for the booking
  const {
    data: reportResponse,
    isLoading,
    isError,
  } = useQuery<ReportResponse>({
    queryKey: ["booking-reports", bookingId, bookingType, currentPage],
    queryFn: async () => {
      const res = await api.get(
        `admin/reports/${bookingId}/${bookingType}/?page=${currentPage}`,
      );
      console.log("Fetched reports:", res.data);
      return res.data;
    },
    enabled: !!bookingId && !!bookingType,
  });

  const reports = reportResponse?.results || [];
  const totalReports = reportResponse?.count || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
  };

  const getWorkerName = (worker: WorkerDetails | string): string => {
    if (typeof worker === "string") return worker;
    return worker.full_name;
  };

  const handleNextPage = () => {
    if (reportResponse?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (reportResponse?.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Booking Reports
                </h1>
                <p className="text-gray-600 mt-1">
                  Viewing all reports for Booking #{bookingId}
                </p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">
                  Total Reports: {totalReports}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500">Loading reports...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
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
                <p className="text-gray-600 mb-4">Failed to load reports</p>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  No reports found for this booking
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Report ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Service Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Report Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Worker
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Photos
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.map((report) => (
                        <tr
                          key={report.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {report.booking_code}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {report.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              {formatDate(report.service_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {report.report_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">
                                {getWorkerName(report.worker_details)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-md bg-green-100 text-green-800">
                              {report.treatment_photos?.length || 0} photos
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleViewReport(report.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {reportResponse && totalReports > 10 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing page {currentPage} - Total {totalReports} reports
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={!reportResponse.previous}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reportResponse.previous
                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={!reportResponse.next}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          reportResponse.next
                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReportId && (
        <BookingReportModal
          bookingId={parseInt(bookingId || "0")}
          bookingType={bookingType || "procedure"}
        //   reportId={selectedReportId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ReportsPage;
