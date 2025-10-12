import React from "react";
import {
  X,
  User,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react";
import type { CaregiverBookingData } from "../../types/bookingdata";

interface CaregiverBookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: CaregiverBookingData;
}

const CaregiverBookingModal: React.FC<CaregiverBookingDetailsModalProps> = ({
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
        return <CheckCircle className="w-5 h-5" />;
      case "assigned":
        return <Clock className="w-5 h-5" />;
      case "cancelled":
        return <AlertCircle className="w-5 h-5" />;
      case "pending":
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAssignedWorkerName = () => {
    if (!booking.assigned_worker) return "Not assigned yet";
    if (typeof booking.assigned_worker === "string")
      return booking.assigned_worker;
    return `${booking.assigned_worker.first_name} ${booking.assigned_worker.last_name}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Caregiving Request Details
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
            {/* Patient Information */}
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
                    <span className="text-sm text-gray-600">Age:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {booking.patient_age} years
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Medical Condition
                  </h3>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {booking.medical_condition}
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">
                    Emergency Contact
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-amber-700">Name:</span>
                    <span className="text-sm font-medium text-amber-900">
                      {booking.emergency_contact_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-amber-700">Phone:</span>
                    <a
                      href={`tel:${booking.emergency_contact_phone}`}
                      className="text-sm font-medium text-amber-900 hover:underline"
                    >
                      {booking.emergency_contact_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              {/* Care Service Type */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">
                    Care Service
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Type:</span>
                    <span className="text-sm font-medium text-purple-900">
                      {booking.caregiver_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-purple-700">Duration:</span>
                    <span className="text-sm font-medium text-purple-900">
                      {booking.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Location Details
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">
                      Care Location:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {booking.care_location}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">
                      Address:
                    </span>
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">
                      {booking.care_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Schedule</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(booking.start_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Worker */}
              {booking.assigned_worker && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      Assigned Caregiver
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Name:</span>
                      <span className="text-sm font-medium text-green-900">
                        {getAssignedWorkerName()}
                      </span>
                    </div>
                    {typeof booking.assigned_worker !== "string" &&
                      booking.assigned_worker.email_address && (
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">Email:</span>
                          <a
                            href={`mailto:${booking.assigned_worker.email_address}`}
                            className="text-sm font-medium text-green-900 hover:underline"
                          >
                            {booking.assigned_worker.email_address}
                          </a>
                        </div>
                      )}
                  </div>
                </div>
              )}
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

          {/* Pricing */}
          <div className="mt-6 bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-green-900">
                  {formatPrice(booking.total_price)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
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

export default CaregiverBookingModal;
