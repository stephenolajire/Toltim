import React from "react";
import {
  X,
  User,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Stethoscope,
  Clock,
} from "lucide-react";

interface CHWInfo {
  id: string;
  email_address: string;
  first_name: string;
  full_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
}

interface ServiceItem {
  service: string;
  price_per_day: string;
}

interface BedsideBooking {
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

interface BedsideBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BedsideBooking | null;
}

const BedsideBookingDetailsModal: React.FC<BedsideBookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toLocaleString()}`;
  };

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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bedside Care Booking Details
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Patient Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-semibold text-gray-900">
                    {booking.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room/Ward</p>
                  <p className="font-semibold text-gray-900">
                    {booking.room_ward}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Hospital Information
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Hospital Name</p>
                <p className="font-semibold text-gray-900">
                  {booking.hospital_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Address
                </p>
                <p className="font-medium text-gray-900">
                  {booking.hospital_address}
                </p>
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Admission Details
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Admission Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.admission_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Discharge</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.expected_discharge)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </p>
                <p className="font-semibold text-gray-900">
                  {booking.number_of_days} day
                  {booking.number_of_days !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Services Requested
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {booking.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 capitalize">
                        {item.service}
                      </span>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {formatPrice(item.price_per_day)}/day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {booking.special_requirements && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Special Requirements
                </h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {booking.special_requirements}
                </p>
              </div>
            </div>
          )}

          {/* Assigned CHW */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Assigned Community Health Worker
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {booking.chw_info.profile_picture ? (
                    <img
                      src={booking.chw_info.profile_picture}
                      alt={booking.chw_info.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {booking.chw_info.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.chw_info.email_address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.chw_info.phone_number}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Cost Summary
              </h3>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Cost</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(booking.total_cost)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                For {booking.number_of_days} day
                {booking.number_of_days !== 1 ? "s" : ""} of service
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Created At</p>
                <p className="font-medium text-gray-900">
                  {formatDate(booking.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {formatDate(booking.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedsideBookingDetailsModal;
