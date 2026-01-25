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
  Image,
  XCircle,
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
  selected_days: string[] | null;
  service_dates: string[];
  is_for_self: boolean;
  status: "pending" | "accepted" | "active" | "completed" | "rejected";
  total_amount?: string;
  total_amount_display: string;
  total_sessions: number;
  draft_sessions: number;
  reviewed: boolean;
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
      specialties?: Array<{ id: number; name: string }>;
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
  test_result: string;
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
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
      // Handle time format like "14:00:00"
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const formatAmount = (amount: string | number) => {
    try {
      const numAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;
      return numAmount.toLocaleString();
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
      accepted: {
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
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
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
        return `Daily appointments${numDays ? ` for ${numDays} day${numDays > 1 ? "s" : ""}` : ""}`;
      case "specific-days":
        if (selected_days && selected_days.length > 0) {
          const days = selected_days.join(", ");
          return `${days} each week${numDays ? ` for ${numDays} day${numDays > 1 ? "s" : ""}` : ""}`;
        }
        return "Specific days selected";
      case "every-other-day":
        return `Every other day${numDays ? ` for ${numDays} day${numDays > 1 ? "s" : ""}` : ""}`;
      case "weekly":
        return `Weekly appointments${numDays ? ` for ${numDays} day${numDays > 1 ? "s" : ""}` : ""}`;
      default:
        return scheduling_option;
    }
  };

  // const getPatientName = () => {
  //   if (booking.is_for_self) {
  //     return "Self-booking";
  //   }
  //   if (
  //     booking.patient_detail?.first_name &&
  //     booking.patient_detail?.last_name
  //   ) {
  //     return `${booking.patient_detail.first_name} ${booking.patient_detail.last_name}`;
  //   }
  //   return "Patient name not provided";
  // };

  const getLocationAddress = (location: string) => {
    // Parse the SRID location format if needed
    if (location && location.includes("POINT")) {
      return location.replace(
        /SRID=\d+;POINT \(([^\)]+)\)/,
        "Location coordinates",
      );
    }
    return location || "Location not specified";
  };

  const handleViewTestResult = () => {
    if (booking.test_result) {
      const baseUrl = "https://toltim-api.sync360.africa/";
      const imageUrl = booking.test_result.startsWith("/")
        ? `${baseUrl}${booking.test_result}`
        : `${baseUrl}${booking.test_result}`;
      window.open(imageUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-start justify-between p-6 pb-4 border-b">
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
                      Booking Details
                    </h2>
                    <p className="text-gray-600">
                      Booking ID: {booking.booking_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {getStatusBadge(booking.status)}
                  {booking.nurse_full_name && (
                    <span className="text-sm text-gray-500">
                      Nurse: {booking.nurse_full_name}
                    </span>
                  )}
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
            <div className="p-6 space-y-8">
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
                        {booking.patient_detail?.first_name} {booking.patient_detail?.last_name}
                      </p>
                    </div>

                    {booking.patient_detail && (
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
                    {booking.patient_detail?.relationship_to_patient && (
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
                            {getLocationAddress(booking.service_location)}
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

                  {/* Specialties */}
                  {booking.procedure_item.procedure.specialties &&
                    booking.procedure_item.procedure.specialties.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Specialties
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {booking.procedure_item.procedure.specialties.map(
                            (specialty) => (
                              <span
                                key={specialty.id}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {specialty.name}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

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
                          Sessions Status
                        </label>
                        <p className="text-gray-900">
                          {booking.total_sessions} total •{" "}
                          {booking.draft_sessions} draft
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

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Reviewed Status
                        </label>
                        <div className="flex items-center gap-2">
                          {booking.reviewed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <p className="text-gray-900">
                            {booking.reviewed ? "Reviewed" : "Not Reviewed"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Price per session
                        </label>
                        <p className="text-gray-900 font-semibold">
                          ₦
                          {formatAmount(booking.procedure_item.procedure.price)}
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
                          ₦{formatAmount(booking.total_amount_display)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Procedure Status
                        </label>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {booking.procedure_item.procedure.status}
                        </span>
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
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Service Requirements */}
                  {booking.procedure_item.procedure.requirements &&
                    booking.procedure_item.procedure.requirements.length >
                      0 && (
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
                            ),
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

                    {booking.service_dates &&
                      booking.service_dates.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Service Dates
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {booking.service_dates.map((date, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                              >
                                {new Date(date).toLocaleDateString()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Schedule Pattern
                      </label>
                      <p className="text-gray-900">
                        {getScheduleDescription()}
                      </p>
                    </div>

                    {booking.selected_days &&
                      booking.selected_days.length > 0 && (
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

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Procedure ID:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {booking.procedure_item.procedure.procedure_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatDate(booking.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4">
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Details
                </button>

                {booking.test_result && (
                  <button
                    onClick={handleViewTestResult}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    View Test Result
                  </button>
                )}
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
    </div>
  );
};

export default BookingDetailsModal;
