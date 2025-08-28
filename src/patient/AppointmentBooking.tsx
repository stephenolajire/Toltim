import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Stethoscope,
  Heart,
  UserCheck,
  User,
  Home,
  Building,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

// Types
interface Provider {
  id: string;
  name: string;
  type: "doctor" | "nurse" | "chw";
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  consultationFee: number;
  homeVisitFee?: number;
  profileImage?: string;
  verified: boolean;
  languages: string[];
  location: string;
  bio: string;
  education: string[];
  availability: {
    [key: string]: string[];
  };
}

// interface TimeSlot {
//   time: string;
//   available: boolean;
// }

interface AppointmentData {
  type: "consultation" | "home-visit";
  date: string;
  time: string;
  notes: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  symptoms: string;
  urgency: "routine" | "urgent" | "emergency";
}

// Mock provider data
const mockProvider: Provider = {
  id: "1",
  name: "Dr. Sarah Johnson",
  type: "doctor",
  specialty: "Gynecologist",
  rating: 4.8,
  reviewCount: 124,
  yearsExperience: 12,
  consultationFee: 8000,
  homeVisitFee: 15000,
  verified: true,
  languages: ["English", "Igbo"],
  location: "Onitsha Main Market",
  bio: "Dr. Sarah Johnson is a board-certified gynecologist with over 12 years of experience in women's health. She specializes in reproductive health, prenatal care, and minimally invasive surgical procedures.",
  education: [
    "MBBS - University of Nigeria",
    "Residency - Lagos University Teaching Hospital",
    "Fellowship - Royal College of Obstetricians",
  ],
  availability: {
    "2025-07-21": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
    "2025-07-22": ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
    "2025-07-23": ["10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
    "2025-07-24": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"],
    "2025-07-25": ["9:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  },
};

// Generate next 7 days
const getNextSevenDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
};

const AppointmentBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<
    "details" | "schedule" | "patient-info" | "confirmation"
  >("details");
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    type: "consultation",
    date: "",
    time: "",
    notes: "",
    patientName: "",
    patientPhone: "",
    patientAge: "",
    symptoms: "",
    urgency: "routine",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const provider = mockProvider;
  const nextSevenDays = getNextSevenDays();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="w-6 h-6" />;
      case "nurse":
        return <Heart className="w-6 h-6" />;
      case "chw":
        return <UserCheck className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-600";
      case "nurse":
        return "bg-green-100 text-green-600";
      case "chw":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "schedule":
        setCurrentStep("details");
        break;
      case "patient-info":
        setCurrentStep("schedule");
        break;
      case "confirmation":
        setCurrentStep("patient-info");
        break;
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("schedule");
        break;
      case "schedule":
        setCurrentStep("patient-info");
        break;
      case "patient-info":
        setCurrentStep("confirmation");
        break;
    }
  };

  const handleBookAppointment = () => {
    // Simulate booking process
    setIsBooked(true);
  };

  const canProceedFromSchedule = selectedDate && selectedTime;
  const canProceedFromPatientInfo =
    appointmentData.patientName &&
    appointmentData.patientPhone &&
    appointmentData.patientAge;

  const renderProviderDetails = () => (
    <div className="space-y-6">
      {/* Provider Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${getTypeColor(
              provider.type
            )}`}
          >
            {getTypeIcon(provider.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {provider.name}
              </h1>
              {provider.verified && (
                <div className="ml-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-lg text-gray-600 capitalize mt-1">
              {provider.type} • {provider.specialty}
            </p>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
              <span className="ml-4 text-gray-600">
                {provider.yearsExperience} years experience
              </span>
            </div>
            <div className="flex items-center mt-2">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600">{provider.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Appointment Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() =>
              setAppointmentData({ ...appointmentData, type: "consultation" })
            }
            className={`p-4 border rounded-lg text-left transition-colors ${
              appointmentData.type === "consultation"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center mb-3">
              <Building className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-900">
                In-Person Consultation
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Visit the provider's clinic or hospital
            </p>
            <p className="text-lg font-semibold text-green-600">
              ₦{provider.consultationFee.toLocaleString()}
            </p>
          </button>

          {provider.homeVisitFee && (
            <button
              onClick={() =>
                setAppointmentData({ ...appointmentData, type: "home-visit" })
              }
              className={`p-4 border rounded-lg text-left transition-colors ${
                appointmentData.type === "home-visit"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center mb-3">
                <Home className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="font-semibold text-gray-900">Home Visit</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Provider visits you at your home
              </p>
              <p className="text-lg font-semibold text-green-600">
                ₦{provider.homeVisitFee.toLocaleString()}
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Provider Bio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          About {provider.name}
        </h2>
        <p className="text-gray-600 mb-4">{provider.bio}</p>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Education & Qualifications
          </h3>
          <ul className="space-y-1">
            {provider.education.map((edu, index) => (
              <li key={index} className="text-gray-600 text-sm">
                • {edu}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
          <p className="text-gray-600">{provider.languages.join(", ")}</p>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        Continue to Scheduling
      </button>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Date
        </h2>
        <div className="grid grid-cols-7 gap-2">
          {nextSevenDays.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`p-3 text-center border rounded-lg transition-colors ${
                selectedDate === day.date
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-xs text-gray-500 uppercase">
                {day.dayName}
              </div>
              <div className="text-lg font-semibold">{day.dayNumber}</div>
              <div className="text-xs text-gray-500">{day.monthName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Time
          </h2>
          {provider.availability[selectedDate] ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {provider.availability[selectedDate].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-center border rounded-lg transition-colors ${
                    selectedTime === time
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No available slots for this date</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Appointment Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800">
              Appointment Summary
            </h3>
          </div>
          <p className="text-green-700">
            {appointmentData.type === "consultation"
              ? "In-Person Consultation"
              : "Home Visit"}{" "}
            with {provider.name}
          </p>
          <p className="text-green-700">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedTime}
          </p>
          <p className="text-green-700 font-semibold">
            Fee: ₦
            {(appointmentData.type === "consultation"
              ? provider.consultationFee
              : provider.homeVisitFee!
            ).toLocaleString()}
          </p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            setAppointmentData({
              ...appointmentData,
              date: selectedDate,
              time: selectedTime,
            });
            handleNext();
          }}
          disabled={!canProceedFromSchedule}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            canProceedFromSchedule
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderPatientInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Patient Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={appointmentData.patientName}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    patientName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter patient's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={appointmentData.patientPhone}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    patientPhone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                value={appointmentData.patientAge}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    patientAge: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={appointmentData.urgency}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    urgency: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms or Reason for Visit
            </label>
            <textarea
              value={appointmentData.symptoms}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  symptoms: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Please describe your symptoms or reason for the appointment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={appointmentData.notes}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  notes: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any additional information or special requests..."
            />
          </div>
        </div>
      </div>

      {appointmentData.urgency === "emergency" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Emergency Notice</h3>
          </div>
          <p className="text-red-700 mt-1">
            For medical emergencies, please call emergency services immediately
            or visit the nearest emergency room.
          </p>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceedFromPatientInfo}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            canProceedFromPatientInfo
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Review & Confirm
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    if (isBooked) {
      return (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Appointment Booked!
            </h2>
            <p className="text-gray-600">
              Your appointment has been successfully scheduled.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-green-800 mb-4">
              Appointment Details
            </h3>
            <div className="space-y-2 text-green-700">
              <p>
                <span className="font-medium">Provider:</span> {provider.name}
              </p>
              <p>
                <span className="font-medium">Patient:</span>{" "}
                {appointmentData.patientName}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {appointmentData.type === "consultation"
                  ? "In-Person Consultation"
                  : "Home Visit"}
              </p>
              <p>
                <span className="font-medium">Date & Time:</span>{" "}
                {new Date(appointmentData.date).toLocaleDateString()} at{" "}
                {appointmentData.time}
              </p>
              <p>
                <span className="font-medium">Fee:</span> ₦
                {(appointmentData.type === "consultation"
                  ? provider.consultationFee
                  : provider.homeVisitFee!
                ).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Booking ID:</span> APT-
                {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">What's Next?</h3>
            </div>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• You will receive a confirmation SMS/call shortly</li>
              <li>• The provider may contact you before the appointment</li>
              <li>
                • Please arrive 15 minutes early for in-person consultations
              </li>
              <li>
                • You can reschedule or cancel up to 2 hours before the
                appointment
              </li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Book Another Appointment
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
              View My Appointments
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirm Your Appointment
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(
                  provider.type
                )}`}
              >
                {getTypeIcon(provider.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-gray-600">{provider.specialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Appointment Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Type:</span>{" "}
                    {appointmentData.type === "consultation"
                      ? "In-Person Consultation"
                      : "Home Visit"}
                  </p>
                  <p>
                    <span className="text-gray-600">Date:</span>{" "}
                    {new Date(appointmentData.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p>
                    <span className="text-gray-600">Time:</span>{" "}
                    {appointmentData.time}
                  </p>
                  <p>
                    <span className="text-gray-600">Fee:</span> ₦
                    {(appointmentData.type === "consultation"
                      ? provider.consultationFee
                      : provider.homeVisitFee!
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Patient Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Name:</span>{" "}
                    {appointmentData.patientName}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    {appointmentData.patientPhone}
                  </p>
                  <p>
                    <span className="text-gray-600">Age:</span>{" "}
                    {appointmentData.patientAge}
                  </p>
                  <p>
                    <span className="text-gray-600">Urgency:</span>{" "}
                    <span
                      className={`capitalize ${
                        appointmentData.urgency === "emergency"
                          ? "text-red-600"
                          : appointmentData.urgency === "urgent"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {appointmentData.urgency}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {appointmentData.symptoms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Symptoms/Reason for Visit
                </h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                  {appointmentData.symptoms}
                </p>
              </div>
            )}

            {appointmentData.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Additional Notes
                </h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                  {appointmentData.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">
              Payment Information
            </h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Payment can be made in cash during your appointment or through
            mobile money transfer. Some providers also accept bank transfers.
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleBookAppointment}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className=" mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h1>
            <p className="text-gray-600">
              Schedule your healthcare appointment
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {!isBooked && (
          <div className="flex items-center space-x-4 mb-6">
            {["details", "schedule", "patient-info", "confirmation"].map(
              (step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? "bg-green-600 text-white"
                          : [
                              "details",
                              "schedule",
                              "patient-info",
                              "confirmation",
                            ].indexOf(currentStep) > index
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden sm:block ${
                        currentStep === step
                          ? "text-green-600"
                          : [
                              "details",
                              "schedule",
                              "patient-info",
                              "confirmation",
                            ].indexOf(currentStep) > index
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step === "details"
                        ? "Provider Details"
                        : step === "schedule"
                        ? "Select Schedule"
                        : step === "patient-info"
                        ? "Patient Info"
                        : "Confirmation"}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        [
                          "details",
                          "schedule",
                          "patient-info",
                          "confirmation",
                        ].indexOf(currentStep) > index
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        {currentStep === "details" && renderProviderDetails()}
        {currentStep === "schedule" && renderScheduling()}
        {currentStep === "patient-info" && renderPatientInfo()}
        {currentStep === "confirmation" && renderConfirmation()}
      </div>
    </div>
  );
};

export default AppointmentBooking;
