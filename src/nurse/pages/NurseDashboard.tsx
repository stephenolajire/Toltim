import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // MapPin,
  Clock,
  FileText,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import api from "../../constant/api";
import BookingDetailsModal from "../components/BookingDetailsModal";
// import BedsideBookingDetailsModal from "../../components/BedSideModal";
import { type Booking } from "../../types/bookingdata";
import { toast } from "react-toastify";
import LocationDisplay from "../../components/LocationDisplay";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

const NurseDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const [acceptingRequests, setAcceptingRequests] = React.useState<Set<number>>(
    new Set()
  );

  const [rejectingRequests, setRejectingRequests] = React.useState<Set<number>>(
    new Set()
  );

  const queryClient = useQueryClient();

  // Fetch bookings using TanStack Query
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["nurse-bookings"],
    queryFn: async () => {
      const response = await api.get("services/nurse-procedure-bookings/");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for new requests
  });

  const bookings = data?.results || [];
  console.log(bookings);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "assigned":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatPrice = (total_amount_display: string | number) => {
    const numPrice =
      typeof total_amount_display === "string"
        ? parseFloat(total_amount_display)
        : total_amount_display;
    return `₦${numPrice.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // const formatTime = (timeString: string) => {
  //   try {
  //     return new Date(timeString).toLocaleTimeString("en-US", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       hour12: true,
  //     });
  //   } catch {
  //     return "Invalid time";
  //   }
  // };

  const getTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      if (diffHours > 0)
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      return "Just now";
    } catch {
      return "Recently";
    }
  };

  const getPatientName = (booking: Booking) => {
    if (booking.is_for_self) {
      return "Self-booking patient";
    }
    if (
      booking.patient_detail?.first_name &&
      booking.patient_detail?.last_name
    ) {
      return `${booking.patient_detail.first_name} ${booking.patient_detail.last_name}`;
    }
    return "Patient name not provided";
  };

  const handleViewFullAssessment = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = async (bookingId: number) => {
    setAcceptingRequests((prev) => new Set(prev).add(bookingId));

    try {
      await api.patch(
        `services/nurse-procedure-bookings/${bookingId}/approve/`
      );

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["nurse-bookings"],
      });

      toast.success("Request accepted successfully!");
    } catch (error: any) {
      console.error("Failed to accept request:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to accept request";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setAcceptingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (bookingId: any) => {
    if (!confirm("Are you sure you want to reject this request?")) {
      return;
    }

    setRejectingRequests((prev) => new Set(prev).add(bookingId));

    try {
      await api.patch(
        `services/nurse-procedure-bookings/${bookingId}/reject/`,
        {
          rejection_reason: "rejected",
        }
      );

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["nurse-bookings"],
      });

      toast.success("Request rejected successfully!");
    } catch (error: any) {
      console.error("Failed to reject request:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to reject request";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setRejectingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Requests</h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Requests</h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Failed to load patient requests
            </h3>
            <p className="text-red-700">
              {error?.message || "Please check your connection and try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Requests</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {bookings.length} request{bookings.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      <div className="w-full mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 max-w-md mx-auto">
              New requests will appear here when patients book your services.
              Check back later or refresh the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
              >
                {/* Header with status */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {booking.procedure_item.procedure.icon_url ? (
                            <img
                              src={booking.procedure_item.procedure.icon_url}
                              alt="Service icon"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {getPatientName(booking)}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Booking #{booking.booking_id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {booking.procedure_item.procedure.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                      {booking.procedure_item.procedure.description}
                    </p>
                  </div>

                  {/* Location and Time */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <LocationDisplay
                        location={booking.service_location}
                        className="flex items-center gap-1 text-sm text-gray-600 break-words"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        {formatDate(booking.start_date)} at{" "}
                        {booking.time_of_day}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>Created {getTimeAgo(booking.created_at)}</span>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  {booking.selected_days?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {booking.selected_days.slice(0, 3).map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                          >
                            {day.slice(0, 3)}
                          </span>
                        ))}
                        {booking.selected_days.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{booking.selected_days.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Inclusions */}
                  {booking.procedure_item.procedure.inclusions &&
                    booking.procedure_item.procedure.inclusions.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <FileText className="h-3 w-3" />
                          <span>
                            {booking.procedure_item.procedure.inclusions.length}{" "}
                            service inclusion
                            {booking.procedure_item.procedure.inclusions
                              .length !== 1
                              ? "s"
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(booking.total_amount_display)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.procedure_item.num_days > 1
                          ? `${booking.procedure_item.num_days} sessions`
                          : "per session"}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {["accepted", "started"].includes(booking.status) ? (
                      <button
                        disabled
                        className="w-full bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Request Accepted
                      </button>
                    ) : booking.status == "rejected" ? (
                      <button
                        disabled
                        className="w-full bg-red-100 text-red-800 px-3 py-2 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Request Rejected
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(booking.id)}
                          disabled={acceptingRequests.has(booking.id)}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          {acceptingRequests.has(booking.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Accepting...
                            </>
                          ) : (
                            "Accept Request"
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(booking.id)}
                          disabled={rejectingRequests.has(booking.id)}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          {rejectingRequests.has(booking.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Rejecting...
                            </>
                          ) : (
                            "Reject Request"
                          )}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleViewFullAssessment(booking)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <BookingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default NurseDashboard;
