import React from "react";
import {
  X,
  User,
//   MapPin,
  Calendar,
  Clock,
  Building2,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";

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

interface BedsideBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BedsideBooking;
}

const BedsideBookingModal: React.FC<BedsideBookingModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

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
        return <CheckCircle className="w-5 h-5" />;
      case "assigned":
        return <Clock className="w-5 h-5" />;
      case "pending":
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

//   const calculateDuration = () => {
//     try {
//       const admission = new Date(booking.admission_date);
//       const discharge = new Date(booking.expected_discharge);
//       const diffTime = Math.abs(discharge.getTime() - admission.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       return diffDays;
//     } catch {
//       return booking.number_of_days || 0;
//     }
//   };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Bedside Care Request Details
              </h2>
              <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient & Hospital Information */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Patient Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {booking.patient_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Room/Ward:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {booking.room_ward}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hospital Information */}
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <h3 className="font-semibold text-teal-900">
                    Hospital Information
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-teal-700 block mb-1">
                      Hospital Name:
                    </span>
                    <span className="text-sm font-medium text-teal-900">
                      {booking.hospital_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-teal-700 block mb-1">
                      Address:
                    </span>
                    <p className="text-sm font-medium text-teal-900 leading-relaxed">
                      {booking.hospital_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* CHW Information */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-900">
                    Community Health Worker
                  </h3>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  {booking.chw_info.profile_picture ? (
                    <img
                      src={booking.chw_info.profile_picture}
                      alt={booking.chw_info.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-900">
                      {booking.chw_info.full_name}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-indigo-700">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${booking.chw_info.phone_number}`}
                      className="hover:underline"
                    >
                      {booking.chw_info.phone_number}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-indigo-700">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${booking.chw_info.email_address}`}
                      className="hover:underline truncate"
                    >
                      {booking.chw_info.email_address}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Services */}
            <div className="space-y-4">
              {/* Schedule Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Schedule</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Admission Date:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(booking.admission_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Expected Discharge:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(booking.expected_discharge)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-bold text-gray-900">
                      {booking.number_of_days} day
                      {booking.number_of_days !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services List */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Services ({booking.items.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {booking.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.service}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price_per_day)} per day
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-900">
                          {formatPrice(
                            parseFloat(item.price_per_day) *
                              booking.number_of_days
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.number_of_days} day
                          {booking.number_of_days !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Cost Summary */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Total Cost</p>
                    <p className="text-3xl font-bold text-green-900">
                      {formatPrice(booking.total_cost)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      For {booking.number_of_days} day
                      {booking.number_of_days !== 1 ? "s" : ""} of care
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          {booking.special_requirements && (
            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-start gap-2 mb-3">
                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Special Requirements
                  </h3>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    {booking.special_requirements}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Created
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-6">
                {formatDateTime(booking.created_at)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Last Updated
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-6">
                {formatDateTime(booking.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedsideBookingModal;
