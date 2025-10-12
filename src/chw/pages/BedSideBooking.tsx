import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Building2,
//   User,
} from "lucide-react";
import api from "../../constant/api";
import { useBedSide } from "../../constant/GlobalContext";
import BedsideBookingModal from "../components/BedSideModal";
import { toast } from "react-toastify";


export interface CHWInfo {
  id: string;
  email_address: string;
  first_name: string;
  full_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
}

export interface ServiceItem {
  service: string;
  price_per_day: string;
}

export interface BedsideBooking {
  id: string;
  user: string;
  chw: string;
  chw_info: CHWInfo;
  patient_name: string;
  hospital_name: string;
  hospital_address: string;
  room_ward: string;
  admission_date: string;
  expected_discharge: string;
  number_of_days: number;
  items: ServiceItem[];
  special_requirements: string;
  total_cost: string;
  status: "pending" | "assigned" | "active" | "completed";
  created_at: string;
  updated_at: string;
}

const BedsideDashboard: React.FC = () => {
  const [selectedBooking, setSelectedBooking] =
    React.useState<BedsideBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [acceptingRequests, setAcceptingRequests] = React.useState<Set<string>>(
    new Set()
  );
  const [rejectingRequests, setRejectingRequests] = React.useState<Set<string>>(
    new Set()
  );

  const queryClient = useQueryClient();

  // Fetch bedside bookings using custom hook
  const { data, isLoading, error } = useBedSide();

  const bookings = data?.results || [];
  console.log(bookings)

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

//   const calculateDuration = (admissionDate: string, dischargeDate: string) => {
//     try {
//       const admission = new Date(admissionDate);
//       const discharge = new Date(dischargeDate);
//       const diffTime = Math.abs(discharge.getTime() - admission.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays;
//     } catch {
//       return 0;
//     }
//   };

  const handleViewDetails = (booking: BedsideBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = async (bookingId: string) => {
    setAcceptingRequests((prev) => new Set(prev).add(bookingId));

    try {
      await api.post(`inpatient-caregiver/bookings/${bookingId}/set_status/`, {
        status:"approved"
      });

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["bedside-bookings"],
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
      await api.post(
        `inpatient-caregiver/bookings/${bookingId}/set_status/`,
        {
          status: "rejected",
        }
      );

      // Refetch the data to update the UI
      queryClient.invalidateQueries({
        queryKey: ["bedside-bookings"],
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
            Bedside Care Requests
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

  if (error) {
    return (
      <div className="w-full pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bedside Care Requests
          </h1>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Failed to load bedside care requests
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
        <h1 className="text-2xl font-bold text-gray-900">
          Bedside Care Requests
        </h1>
        <div onClick={()=> window.history.back()} className="text-sm text-gray-500 border-gray-500 border-1 rounded-2xl px-10 py-2">
          Back
        </div>
      </div>

      <div className="w-full mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              No bedside care requests yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              New bedside care requests will appear here when patients book your
              services. Check back later or refresh the page.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.map((booking:any) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
              >
                {/* Header with status */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {booking.patient_name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Ward: {booking.room_ward}
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

                  {/* Hospital Details */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {booking.hospital_name}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                      {booking.hospital_address}
                    </p>
                  </div>

                  {/* CHW Info */}
                  {/* <div className="mb-4 p-2 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {booking.chw_info.profile_picture ? (
                        <img
                          src={booking.chw_info.profile_picture}
                          alt={booking.chw_info.full_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-indigo-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-indigo-900 truncate">
                          CHW: {booking.chw_info.full_name}
                        </p>
                        <p className="text-xs text-indigo-700 truncate">
                          {booking.chw_info.phone_number}
                        </p>
                      </div>
                    </div>
                  </div> */}

                  {/* Date Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        Admission: {formatDate(booking.admission_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        Discharge: {formatDate(booking.expected_discharge)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{booking.number_of_days} days of care</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>Created {getTimeAgo(booking.created_at)}</span>
                    </div>
                  </div>

                  {/* Services */}
                  {/* {booking.items && booking.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-900 mb-2">
                        Services ({booking.items.length}):
                      </p>
                      <div className="space-y-1">
                        {booking.items.slice(0, 2).map((item:any, index:any) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs bg-gray-50 p-1.5 rounded"
                          >
                            <span className="text-gray-700 truncate">
                              {item.service}
                            </span>
                            <span className="text-gray-900 font-medium ml-2">
                              {formatPrice(item.price_per_day)}/day
                            </span>
                          </div>
                        ))}
                        {booking.items.length > 2 && (
                          <p className="text-xs text-gray-500 pl-1.5">
                            +{booking.items.length - 2} more service
                            {booking.items.length - 2 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(booking.total_cost)}
                      </div>
                      <div className="text-xs text-gray-500">Total cost</div>
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
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {booking.status === "assigned" && "Request Accepted"}
                        {booking.status === "active" && "Service Active"}
                        {booking.status === "completed" && "Service Completed"}
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
        <BedsideBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BedsideDashboard;
