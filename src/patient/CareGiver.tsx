import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Stethoscope,
  HeartHandshake,
  CheckCircle,
  FileText,
  User,

} from "lucide-react";

// Types
interface CaregiverType {
  id: string;
  name: string;
  label: string;
  description: string;
  dailyRate: number;
  fullTimeRate: number;
  icon: React.ReactNode;
  features: string[];
}

interface BookingData {
  caregiverType: CaregiverType | null;
  duration: "daily" | "fulltime";
  patientName: string;
  patientAge: string;
  medicalCondition: string;
  careLocation: string;
  startDate: string;
  emergencyContact: string;
  specialRequirements: string;
  period: number;
}

// Mock Data
const caregiverTypes: CaregiverType[] = [
  {
    id: "professional-nurse",
    name: "Professional Nurse",
    label: "Medical Expert",
    description: "Qualified registered nurse with medical training",
    dailyRate: 4000,
    fullTimeRate: 8000,
    icon: <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
    features: [
      "Medical administration",
      "Vital signs monitoring",
      "Wound care",
      "Emergency response",
    ],
  },
  {
    id: "community-health-worker",
    name: "Community Health Worker",
    label: "Community Care",
    description: "Trained community health professional",
    dailyRate: 2000,
    fullTimeRate: 5000,
    icon: <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
    features: [
      "Basic health monitoring",
      "Medication reminders",
      "Companionship",
      "Daily living assistance",
    ],
  },
];

const CaregiverBooking: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    caregiverType: null,
    duration: "daily",
    patientName: "",
    patientAge: "",
    medicalCondition: "",
    careLocation: "",
    startDate: "",
    emergencyContact: "",
    specialRequirements: "",
    period: 30,
  });

  const handleCaregiverSelect = (caregiver: CaregiverType) => {
    setBookingData((prev) => ({
      ...prev,
      caregiverType: caregiver,
    }));
  };

  const handleDurationSelect = (duration: "daily" | "fulltime") => {
    setBookingData((prev) => ({
      ...prev,
      duration,
    }));
  };

  const handleInputChange = (
    field: keyof BookingData,
    value: string | number
  ) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTotalAmount = () => {
    if (!bookingData.caregiverType) return 0;

    const rate =
      bookingData.duration === "daily"
        ? bookingData.caregiverType.dailyRate
        : bookingData.caregiverType.fullTimeRate;

    return rate * bookingData.period;
  };

  const renderCaregiverCard = (caregiver: CaregiverType) => {
    const isSelected = bookingData.caregiverType?.id === caregiver.id;

    return (
      <div
        key={caregiver.id}
        className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
          isSelected
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => handleCaregiverSelect(caregiver)}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-green-100 text-green-600 border-green-200 flex items-center justify-center flex-shrink-0">
                {caregiver.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg">
                    {caregiver.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full border border-green-200">
                    {caregiver.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {caregiver.description}
                </p>
                <div className="flex flex-col space-y-1 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Daily Rate</span>
                    <span className="font-semibold text-green-600">
                      ₦{caregiver.dailyRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Full-time: ₦{caregiver.fullTimeRate.toLocaleString()}/day
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center ml-2 flex-shrink-0">
              {isSelected && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm">
            {caregiver.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 text-gray-600"
              >
                <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDurationCard = (
    duration: "daily" | "fulltime",
    title: string,
    subtitle: string
  ) => {
    const isSelected = bookingData.duration === duration;

    return (
      <div
        className={`bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 p-4 text-center ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => handleDurationSelect(duration)}
      >
        <div className="flex flex-col items-center space-y-2">
          <Clock
            className={`w-8 h-8 ${
              isSelected ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <div>
            <h3
              className={`font-semibold ${
                isSelected ? "text-blue-900" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-sm ${
                isSelected ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {subtitle}
            </p>
          </div>
          {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-2 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="mr-2 sm:mr-4 p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Book Caregiver Service
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Professional healthcare assistance at your location
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Step 1: Select Caregiver Type */}
            <div className="bg-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <HeartHandshake className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Select Caregiver Type</h2>
              </div>
              <p className="text-green-100 text-sm">
                Choose the type of caregiver that best fits your needs
              </p>
            </div>

            <div className="space-y-3">
              {caregiverTypes.map(renderCaregiverCard)}
            </div>

            {/* Step 2: Select Care Duration */}
            {bookingData.caregiverType && (
              <>
                <div className="bg-blue-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">
                      Select Care Duration
                    </h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Choose how often you need caregiver services
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {renderDurationCard(
                    "daily",
                    "Daily Visits",
                    "2-4 hours per day"
                  )}
                  {renderDurationCard(
                    "fulltime",
                    "Full-time Stay",
                    "24-hour live-in care"
                  )}
                </div>
              </>
            )}

            {/* Step 3: Patient Information */}
            {bookingData.caregiverType && (
              <>
                <div className="bg-purple-600 rounded-lg p-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">
                      Patient Information
                    </h2>
                  </div>
                  <p className="text-purple-100 text-sm">
                    Provide details about the patient needing care
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={bookingData.patientName}
                        onChange={(e) =>
                          handleInputChange("patientName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Age
                      </label>
                      <input
                        type="text"
                        placeholder="Age"
                        value={bookingData.patientAge}
                        onChange={(e) =>
                          handleInputChange("patientAge", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Condition/Reason for Care
                    </label>
                    <textarea
                      placeholder="Describe the patient's condition or reason for needing care"
                      value={bookingData.medicalCondition}
                      onChange={(e) =>
                        handleInputChange("medicalCondition", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Care Location
                      </label>
                      <input
                        type="text"
                        placeholder="Full address"
                        value={bookingData.careLocation}
                        onChange={(e) =>
                          handleInputChange("careLocation", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      placeholder="Name and phone number"
                      value={bookingData.emergencyContact}
                      onChange={(e) =>
                        handleInputChange("emergencyContact", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      placeholder="Any special needs or requirements"
                      value={bookingData.specialRequirements}
                      onChange={(e) =>
                        handleInputChange("specialRequirements", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-purple-600 rounded-lg p-4 text-white mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {bookingData.caregiverType ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Caregiver Type:</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {bookingData.caregiverType.name}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Duration:</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {bookingData.duration === "daily"
                          ? "Daily Visits"
                          : "Full-time Stay"}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Period:</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {bookingData.period} days
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                        <span>Total Amount:</span>
                        <span className="text-purple-600">
                          ₦{getTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 text-sm">
                        What's Included:
                      </h4>
                      <ul className="space-y-1 text-xs text-green-700">
                        <li>• Professional caregiver assignment</li>
                        <li>• 24/7 support hotline</li>
                        <li>• Regular progress reports</li>
                        <li>• Emergency response protocol</li>
                      </ul>
                    </div>

                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                      disabled={
                        !bookingData.patientName ||
                        !bookingData.careLocation ||
                        !bookingData.startDate
                      }
                    >
                      Book Caregiver Service
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <HeartHandshake className="w-12 h-12 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Select a caregiver type
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Choose from our professional caregivers to see your
                      booking summary
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverBooking;
