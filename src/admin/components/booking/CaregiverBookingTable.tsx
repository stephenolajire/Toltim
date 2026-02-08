import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  DollarSign,
  Eye,
  UserPlus,
//   CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { CaregiverBookingInfo } from "../../../types/carebooking";

interface CaregiverBookingTableProps {
  bookings: CaregiverBookingInfo[];
  onAssignWorker: (bookingId: string) => void;
  onViewDetails: (bookingId: string) => void;
  onApprove?: (bookingId: string, userId: string) => void;
  onCancel?: (bookingId: string) => void;
  isLoading?: boolean;
}

const CaregiverBookingTable: React.FC<CaregiverBookingTableProps> = ({
  bookings,
  onAssignWorker,
  onViewDetails,
//   onApprove,
  // onCancel,
  isLoading = false,
}) => {
  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? price : `₦${numPrice.toLocaleString()}`;
  };

  const getDurationLabel = (duration: string) => {
    const labels: Record<string, string> = {
      daily_visits: "Daily Visits",
      live_in: "Live-In",
      hourly: "Hourly",
      overnight: "Overnight",
    };
    return labels[duration] || duration;
  };

  const canAssign = (booking: CaregiverBookingInfo) =>
    booking.status === "pending" && !booking.assigned_worker;
//   const canApprove = (booking: CaregiverBooking) =>
//     booking.status === "assigned";
  // const canCancel = (booking: CaregiverBookingInfo) =>
  //   ["pending", "assigned"].includes(booking.status);

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Patient Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Caregiver Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Medical Condition
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Assigned Worker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Total Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                          {booking.patient_name}
                          {booking.patient_age && (
                            <span className="text-xs text-gray-500 font-normal">
                              ({booking.patient_age}y)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Code: {booking.booking_code}
                        </div>
                        {booking.emergency_contact_name && (
                          <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {booking.emergency_contact_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {booking.emergency_contact_phone}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {booking.caregiver_type}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{getDurationLabel(booking.duration)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {booking.care_address}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{formatDate(booking.start_date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-xs">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="line-clamp-2">
                              {booking.medical_condition}
                            </p>
                            {booking.special_requirements && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {booking.special_requirements}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span
                          className={
                            booking.assigned_worker
                              ? "text-gray-900"
                              : "text-gray-400 italic"
                          }
                        >
                          {booking.assigned_worker
                            ? `${booking.assigned_worker.first_name} ${booking.assigned_worker.last_name}`
                            : "Not assigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatPrice(booking.total_price)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {canAssign(booking) && (
                          <button
                            onClick={() => onAssignWorker(booking.id)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <UserPlus className="w-3 h-3" />
                            {isLoading ? "Processing..." : "Assign"}
                          </button>
                        )}
                        {/* {canApprove(booking) && onApprove && (
                          <button
                            onClick={() => onApprove(booking.id, booking.user)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {isLoading ? "Processing..." : "Approve"}
                          </button>
                        )} */}
                        <button
                          onClick={() => onViewDetails(booking.id)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        {/* {canCancel(booking) && onCancel && (
                          <button
                            onClick={() => onCancel(booking.id)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                        )} */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {bookings.length > 0 && (
        <div className="mt-2 pb-2 text-xs text-gray-500 text-center sm:hidden">
          Scroll horizontally to see all columns →
        </div>
      )}
    </div>
  );
};

export default CaregiverBookingTable;
