import React from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";

interface Booking {
  id: number;
  booking_id: string;
  user: string;
  nurse: string;
  nurse_full_name?: string;
  scheduling_option: string;
  start_date: string;
  time_of_day: string;
  selected_days: string[];
  service_dates: string;
  is_for_self: boolean;
  status: "pending" | "accepted" | "active" | "completed";
  total_amount: string;
  procedure_item: {
    procedure: {
      id: number;
      procedure_id: string;
      title: string;
      description: string;
      duration: string;
      repeated_visits: boolean;
      price: string;
      icon_url: string;
      status: string;
      inclusions?: Array<{ id: number; item: string }>;
      requirements?: Array<{ id: number; item: string }>;
      created_at: string;
      updated_at: string;
    };
    procedure_id: number;
    num_days: number;
    subtotal: string;
  };
  patient_detail?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    relationship_to_patient: string;
  };
  service_address: string;
  service_location: string;
  created_at: string;
  updated_at: string;
}

interface PatientAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

const BookingDetailsModal: React.FC<PatientAssessmentModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid time";
    }
  };

  const formatAmount = (amount: string) => {
    try {
      return parseFloat(amount).toLocaleString();
    } catch {
      return amount;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
      },
      assigned: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      active: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      completed: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: CheckCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border gap-2 ${config.color}`}
      >
        <IconComponent className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getScheduleDescription = () => {
    const { scheduling_option, selected_days, procedure_item } = booking;
    const numDays = procedure_item?.num_days;

    switch (scheduling_option) {
      case "daily":
        return `Daily appointments${numDays ? ` for ${numDays} days` : ""}`;
      case "specific-days":
        const days = selected_days?.join(", ") || "Selected days";
        return `${days} each week${numDays ? ` for ${numDays} days` : ""}`;
      case "every-other-day":
        return `Every other day${numDays ? ` for ${numDays} days` : ""}`;
      case "weekly":
        return `Weekly appointments${numDays ? ` for ${numDays} days` : ""}`;
      default:
        return scheduling_option;
    }
  };

  const getPatientName = () => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
        //   className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {booking.procedure_item?.procedure?.icon_url ? (
                    <img
                      src={booking.procedure_item.procedure.icon_url}
                      alt="Service icon"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Patient Assessment
                  </h2>
                  <p className="text-gray-600">
                    Booking ID: {booking.booking_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(booking.status)}
                <span className="text-sm text-gray-500">
                  Created {formatDate(booking.created_at)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Patient Information */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Patient Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {getPatientName()}
                    </p>
                  </div>

                  {!booking.is_for_self && booking.patient_detail && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">
                            {booking.patient_detail.email}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Phone Number
                        </label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">
                            {booking.patient_detail.phone_number}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  {!booking.is_for_self &&
                    booking.patient_detail?.relationship_to_patient && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Relationship to Patient
                        </label>
                        <p className="text-gray-900 capitalize">
                          {booking.patient_detail.relationship_to_patient}
                        </p>
                      </div>
                    )}

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Service Address
                    </label>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 mb-1">
                          {booking.service_address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.service_location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Service Details
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {booking.procedure_item.procedure.title}
                  </h4>
                  <p className="text-gray-700 mt-2">
                    {booking.procedure_item.procedure.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Duration per session
                      </label>
                      <p className="text-gray-900">
                        {booking.procedure_item.procedure.duration}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Number of sessions
                      </label>
                      <p className="text-gray-900">
                        {booking.procedure_item.num_days} session
                        {booking.procedure_item.num_days !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Repeated visits
                      </label>
                      <p className="text-gray-900">
                        {booking.procedure_item.procedure.repeated_visits
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Price per session
                      </label>
                      <p className="text-gray-900 font-semibold">
                        ₦{formatAmount(booking.procedure_item.procedure.price)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Subtotal
                      </label>
                      <p className="text-gray-900 font-semibold">
                        ₦{formatAmount(booking.procedure_item.subtotal)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Total Amount
                      </label>
                      <p className="text-green-600 font-bold text-lg">
                        ₦{formatAmount(booking.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Inclusions */}
                {booking.procedure_item.procedure.inclusions &&
                  booking.procedure_item.procedure.inclusions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Service Inclusions
                      </label>
                      <ul className="list-disc list-inside space-y-1 bg-white rounded-lg p-4">
                        {booking.procedure_item.procedure.inclusions.map(
                          (inclusion) => (
                            <li
                              key={inclusion.id}
                              className="text-gray-700 text-sm"
                            >
                              {inclusion.item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Service Requirements */}
                {booking.procedure_item.procedure.requirements &&
                  booking.procedure_item.procedure.requirements.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Requirements
                      </label>
                      <ul className="list-disc list-inside space-y-1 bg-white rounded-lg p-4">
                        {booking.procedure_item.procedure.requirements.map(
                          (requirement) => (
                            <li
                              key={requirement.id}
                              className="text-gray-700 text-sm"
                            >
                              {requirement.item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Schedule Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <p className="text-gray-900 font-medium">
                      {formatDate(booking.start_date)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Preferred Time
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">
                        {formatTime(booking.time_of_day)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Schedule Pattern
                    </label>
                    <p className="text-gray-900">{getScheduleDescription()}</p>
                  </div>

                  {booking.selected_days?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Selected Days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {booking.selected_days.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 mt-8 border-t border-gray-200 gap-4">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Download Details
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
