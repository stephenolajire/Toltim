import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Clock,
  // FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Heart,
  // Phone,
} from "lucide-react";
import api from "../../constant/api";
import CaregiverBookingModal from "../../nurse/components/CaregiverBookingModal";
import { toast } from "react-toastify";

export interface CaregiverBooking {
  id: string;
  user: string;
  caregiver_type: string;
  duration: string;
  patient_name: string;
  patient_age: number;
  medical_condition: string;
  care_location: string;
  care_address: string;
  start_date: string;
  total_price: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  special_requirements: string;
  status: "pending" | "assigned" | "active" | "completed" | "cancelled";
  assigned_worker:
    | string
    | {
        id: string;
        first_name: string;
        last_name: string;
        email_address: string;
      }
    | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CaregiverBooking[];
}

const CaregiverDashboard: React.FC = () => {
  const [selectedBooking, setSelectedBooking] =
    React.useState<CaregiverBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [acceptingRequests, setAcceptingRequests] = React.useState<Set<string>>(
    new Set()
  );
  const [rejectingRequests, setRejectingRequests] = React.useState<Set<string>>(
    new Set()
  );
  // const [serviceType, setServiceType] = React.useState<
  //   "caregiving" | "bedside"
  // >("caregiving");

  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch caregiver bookings using TanStack Query
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["caregiver-bookings"],
    queryFn: async () => {
      const response = await api.get("caregiver-booking/");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for new requests
  });

  const bookings = data?.results || [];

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
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
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
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "pending":
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
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

  const handleViewDetails = (booking: CaregiverBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = async (bookingId: string) => {
    setAcceptingRequests((prev) => new Set(prev).add(bookingId));

    try {
      const endpoint = `services/caregiver-booking/${bookingId}/approve/`;

      await api.patch(endpoint);

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["caregiver-bookings"],
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

  const handleRejectRequest = async (bookingId: string) => {
    if (!confirm("Are you sure you want to reject this request?")) {
      return;
    }

    setRejectingRequests((prev) => new Set(prev).add(bookingId));

    try {
      const endpoint = `services/caregiver-booking/${bookingId}/reject/`;

      await api.patch(endpoint);

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["caregiver-bookings"],
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
          <h1 className="text-2xl font-bold text-gray-900">
            Caregiving Requests
          </h1>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Caregiving Requests
          </h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Failed to load caregiving requests
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
        <h1 className="text-2xl font-bold text-gray-900">Care Giver Request</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 hidden lg:flex">
            {bookings.length} request{bookings.length !== 1 ? "s" : ""} found
          </div>
          {/* <select
            value={serviceType}
            onChange={(e) =>
              setServiceType(e.target.value as "caregiving" | "bedside")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            <option value="caregiving">Caregiving</option>
            <option value="bedside">Bedside Care</option>
          </select> */}
        </div>
      </div>

      <div className="w-full mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              No Care Giver requests yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              New Care Giver requests will appear here when patients book your
              services. Check back later or refresh the page.
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
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {booking.patient_name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Age: {booking.patient_age} years
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
                      {booking.caregiver_type}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Duration: {booking.duration}
                    </p>
                  </div>

                  {/* Medical Condition */}
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-1">
                      Medical Condition
                    </p>
                    <p className="text-xs text-blue-700">
                      {booking.medical_condition}
                    </p>
                  </div>

                  {/* Location and Date */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{booking.care_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>Starts {formatDate(booking.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>Created {getTimeAgo(booking.created_at)}</span>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {/* <div className="mb-4 p-2 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-amber-900">
                      <Phone className="h-3 w-3" />
                      <span className="font-medium">
                        Emergency: {booking.emergency_contact_name}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 ml-5">
                      {booking.emergency_contact_phone}
                    </p>
                  </div> */}

                  {/* Special Requirements */}
                  {/* {booking.special_requirements && (
                    <div className="mb-4">
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <FileText className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 mb-1">
                            Special Requirements
                          </p>
                          <p className="line-clamp-2">
                            {booking.special_requirements}
                          </p>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(booking.total_price)}
                      </div>
                      <div className="text-xs text-gray-500">Total amount</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {booking.status === "pending" ? (
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
                    ) : (
                      <button
                        disabled
                        className={`w-full px-3 py-2 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2 ${
                          booking.status === "assigned" ||
                          booking.status === "active"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {booking.status === "assigned" && "Request Accepted"}
                        {booking.status === "active" && "Service Active"}
                        {booking.status === "completed" && "Service Completed"}
                        {booking.status === "cancelled" && "Request Cancelled"}
                      </button>
                    )}

                    <button
                      onClick={() => handleViewDetails(booking)}
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
        <CaregiverBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default CaregiverDashboard;
