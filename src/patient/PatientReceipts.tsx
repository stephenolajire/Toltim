import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Shield,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface BookingData {
  id?: number;
  booking_id?: string;
  user?: string;
  nurse?: string;
  nurse_full_name?: string;
  scheduling_option?: string;
  start_date?: string;
  time_of_day?: string;
  selected_days?: string[];
  service_dates?: string;
  is_for_self?: boolean;
  status?: "pending" | "assigned" | "active" | "completed";
  total_amount?: string;
  procedure_item?: {
    procedure?: {
      id?: number;
      procedure_id?: string;
      title?: string;
      description?: string;
      duration?: string;
      repeated_visits?: boolean;
      price?: string;
      icon_url?: string;
      status?: string;
      inclusions?: Array<{ id?: number; item?: string }>;
      requirements?: Array<{ id?: number; item?: string }>;
      created_at?: string;
      updated_at?: string;
    };
    procedure_id?: number;
    num_days?: number;
    subtotal?: string;
  };
  patient_detail?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    relationship_to_patient?: string;
  };
  service_address?: string;
  service_location?: string;
  created_at?: string;
  updated_at?: string;
}

const AppointmentReceipt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from navigation state
  const bookingData: BookingData = location.state?.booking || {};

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available";

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

  const formatTime = (timeString?: string) => {
    if (!timeString) return "Time not available";

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

  const formatAmount = (amount?: string) => {
    if (!amount) return "0";
    try {
      return parseFloat(amount).toLocaleString();
    } catch {
      return amount;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "active":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "assigned":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "pending":
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "active":
        return "bg-blue-100 text-blue-700";
      case "assigned":
        return "bg-blue-100 text-blue-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getScheduleDescription = () => {
    const { scheduling_option, selected_days, procedure_item } = bookingData;
    const numDays = procedure_item?.num_days;

    if (!scheduling_option) return "Schedule not specified";

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

  // If no booking data, show error state
  if (!bookingData.id && !bookingData.booking_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Data Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the booking information. Please try again or
            contact support.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-6 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Appointment Confirmation
                </h1>
                <p className="text-green-600">
                  Booking ID:{" "}
                  {bookingData.booking_id || `#${bookingData.id || "N/A"}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(bookingData.status)}
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Booked on {formatDate(bookingData.created_at)}</span>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6 space-y-6">
            {/* Service & Provider */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                {bookingData.procedure_item?.procedure?.icon_url ? (
                  <img
                    src={bookingData.procedure_item.procedure.icon_url}
                    alt="Service icon"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {bookingData.procedure_item?.procedure?.title ||
                    "Service not specified"}
                </h3>
                <p className="text-green-600 font-medium">
                  {bookingData.nurse_full_name || "Nurse not assigned"}
                </p>
                <p className="text-sm text-gray-600">Registered Nurse</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>
                    {bookingData.service_location || "Location not specified"}
                  </span>
                </div>
                {bookingData.procedure_item?.procedure?.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {bookingData.procedure_item.procedure.description}
                  </p>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDate(bookingData.start_date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(bookingData.time_of_day)}
                    {bookingData.procedure_item?.procedure?.duration &&
                      ` (${bookingData.procedure_item.procedure.duration})`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Schedule:</strong> {getScheduleDescription()}
                  </p>
                  {bookingData.selected_days &&
                    bookingData.selected_days.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {bookingData.selected_days.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Patient Information
              </h3>

              {bookingData.is_for_self ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-2">
                    Booking for self
                  </p>
                  {bookingData.service_address && (
                    <div>
                      <p className="text-gray-600">Service Address</p>
                      <p className="font-medium">
                        {bookingData.service_address}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">
                      {bookingData.patient_detail?.first_name &&
                      bookingData.patient_detail?.last_name
                        ? `${bookingData.patient_detail.first_name} ${bookingData.patient_detail.last_name}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">
                      {bookingData.patient_detail?.phone_number ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">
                      {bookingData.patient_detail?.email || "Not provided"}
                    </p>
                  </div>
                  {bookingData.patient_detail?.relationship_to_patient && (
                    <div>
                      <p className="text-gray-600">Relationship</p>
                      <p className="font-medium capitalize">
                        {bookingData.patient_detail.relationship_to_patient}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium">
                      {bookingData.patient_detail?.address ||
                        bookingData.service_address ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Inclusions */}
            {bookingData.procedure_item?.procedure?.inclusions &&
              bookingData.procedure_item.procedure.inclusions.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Service Inclusions
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {bookingData.procedure_item.procedure.inclusions.map(
                      (inclusion, index) => (
                        <li
                          key={inclusion.id || index}
                          className="text-sm text-gray-600"
                        >
                          {inclusion.item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* Payment Details */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Price per session</span>
                  <span className="font-medium">
                    ₦
                    {formatAmount(bookingData.procedure_item?.procedure?.price)}
                  </span>
                </div>
                {bookingData.procedure_item?.num_days &&
                  bookingData.procedure_item.num_days > 1 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Number of sessions</span>
                      <span className="font-medium">
                        {bookingData.procedure_item.num_days}
                      </span>
                    </div>
                  )}
                {bookingData.procedure_item?.subtotal && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₦{formatAmount(bookingData.procedure_item.subtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg pt-2 border-t">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-green-600">
                    ₦{formatAmount(bookingData.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 rounded-b-lg border-t">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 justify-between">
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
              <div
                className={`px-4 py-2 text-center rounded-lg text-sm font-medium ${getStatusColor(
                  bookingData.status
                )}`}
              >
                {(bookingData.status || "PENDING").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReceipt;
