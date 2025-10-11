import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  // Shield,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  HeartHandshake,
  Phone,
} from "lucide-react";

interface CaregiverBookingData {
  id?: string;
  user?: string;
  caregiver_type?: "nurse" | "chw";
  duration?: "daily_visits" | "full_time";
  patient_name?: string;
  patient_age?: number;
  medical_condition?: string;
  care_location?: string;
  care_address?: string;
  start_date?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  special_requirements?: string;
  assigned_worker?: string | null;
  status?: "pending" | "assigned" | "active" | "completed";
  total_price?: string;
  created_at?: string;
  updated_at?: string;
}

const CaregiverBookingReceipt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get booking data from navigation state
  const bookingData: CaregiverBookingData = location.state?.bookingData || {};
  console.log(bookingData)

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

  const getCaregiverTypeName = (type?: string) => {
    switch (type) {
      case "nurse":
        return "Professional Nurse";
      case "chw":
        return "Community Health Worker";
      default:
        return "Caregiver";
    }
  };

  const getDurationText = (duration?: string) => {
    switch (duration) {
      case "daily_visits":
        return "Daily Visits (2-4 hours per day)";
      case "full_time":
        return "Full-time Stay (24-hour live-in care)";
      default:
        return "Not specified";
    }
  };

  // If no booking data, show error state
  if (!bookingData.id) {
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
          onClick={() => navigate("/patient/dashboard")}
          className="flex items-center space-x-2 mb-6 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Caregiver Booking Confirmation
                </h1>
                <p className="text-green-600">
                  Booking ID: #{bookingData.id?.substring(0, 8) || "N/A"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(bookingData.status)}
                <HeartHandshake className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Booked on {formatDate(bookingData.created_at)}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Service Type */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {getCaregiverTypeName(bookingData.caregiver_type)}
                </h3>
                <p className="text-green-600 font-medium">
                  {bookingData.assigned_worker ||
                    "Caregiver will be assigned soon"}
                </p>
                <p className="text-sm text-gray-600">
                  {getDurationText(bookingData.duration)}
                </p>
              </div>
            </div>

            {/* Start Date */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    Start Date: {formatDate(bookingData.start_date)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Service begins on this date
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Patient Name</p>
                  <p className="font-medium">
                    {bookingData.patient_name || "Not provided"}
                  </p>
                </div>
                {bookingData.patient_age && (
                  <div>
                    <p className="text-gray-600">Age</p>
                    <p className="font-medium">
                      {bookingData.patient_age} years
                    </p>
                  </div>
                )}
                {bookingData.medical_condition && (
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Medical Condition</p>
                    <p className="font-medium">
                      {bookingData.medical_condition}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Care Location */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Care Location
              </h3>
              <p className="text-sm text-gray-600">
                {bookingData.care_address || "Address not provided"}
              </p>
            </div>

            {/* Emergency Contact */}
            {(bookingData.emergency_contact_name ||
              bookingData.emergency_contact_phone) && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {bookingData.emergency_contact_name && (
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">
                        {bookingData.emergency_contact_name}
                      </p>
                    </div>
                  )}
                  {bookingData.emergency_contact_phone && (
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">
                        {bookingData.emergency_contact_phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Requirements */}
            {bookingData.special_requirements && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Special Requirements
                </h3>
                <p className="text-sm text-gray-600">
                  {bookingData.special_requirements}
                </p>
              </div>
            )}

            {/* Service Inclusions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                What's Included
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm text-gray-600">
                  Professional caregiver assignment
                </li>
                <li className="text-sm text-gray-600">24/7 support hotline</li>
                <li className="text-sm text-gray-600">
                  Regular progress reports
                </li>
                <li className="text-sm text-gray-600">
                  Emergency response protocol
                </li>
                {bookingData.caregiver_type === "nurse" && (
                  <>
                    <li className="text-sm text-gray-600">
                      Medical administration
                    </li>
                    <li className="text-sm text-gray-600">
                      Vital signs monitoring
                    </li>
                    <li className="text-sm text-gray-600">Wound care</li>
                  </>
                )}
                {bookingData.caregiver_type === "chw" && (
                  <>
                    <li className="text-sm text-gray-600">
                      Basic health monitoring
                    </li>
                    <li className="text-sm text-gray-600">
                      Medication reminders
                    </li>
                    <li className="text-sm text-gray-600">Companionship</li>
                  </>
                )}
              </ul>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-lg pt-2">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-green-600">
                    ₦{formatAmount(bookingData.total_price)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right">Per day rate</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Important Information
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• A caregiver will be assigned to you within 24 hours</li>
                <li>
                  • You will receive a confirmation call before the start date
                </li>
                <li>
                  • Please ensure someone is available at the care location
                </li>
                <li>
                  • Keep your emergency contact informed about the service
                </li>
              </ul>
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

        {/* Next Steps */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Wait for Assignment</p>
                <p className="text-sm text-gray-600">
                  A qualified caregiver will be assigned within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation Call</p>
                <p className="text-sm text-gray-600">
                  You'll receive a call to confirm details and meet the
                  caregiver
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Service Begins</p>
                <p className="text-sm text-gray-600">
                  Caregiver arrives on your scheduled start date
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverBookingReceipt;
