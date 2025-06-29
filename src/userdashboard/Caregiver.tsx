import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CaregiverType {
  id: string;
  title: string;
  badge: string;
  description: string;
  dailyRate: number;
  fullTimeRate: number;
  skills: string[];
}

interface CareDuration {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PatientFormData {
  patientName: string;
  patientAge: string;
  medicalCondition: string;
  careLocation: string;
  startDate: string;
  emergencyContact: string;
  specialRequirements: string;
}

const CaregiverServicesBooking: React.FC = () => {
  const [selectedCaregiverType, setSelectedCaregiverType] =
    useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [patientData, setPatientData] = useState<PatientFormData>({
    patientName: "",
    patientAge: "",
    medicalCondition: "",
    careLocation: "",
    startDate: "",
    emergencyContact: "",
    specialRequirements: "",
  });

  const navigate =useNavigate()

  const caregiverTypes: CaregiverType[] = [
    {
      id: "professional-nurse",
      title: "Professional Nurse",
      badge: "Medical Expert",
      description: "Qualified registered nurse with medical training",
      dailyRate: 4000,
      fullTimeRate: 96000,
      skills: [
        "Medical administration",
        "Wound care",
        "Vital signs monitoring",
        "Emergency response",
      ],
    },
    {
      id: "community-health-worker",
      title: "Community Health Worker",
      badge: "Community Care",
      description: "Trained community health professional",
      dailyRate: 2000,
      fullTimeRate: 48000,
      skills: [
        "Basic health monitoring",
        "Companionship",
        "Medication reminders",
        "Daily living assistance",
      ],
    },
  ];

  const careDurations: CareDuration[] = [
    {
      id: "daily-visits",
      title: "Daily Visits",
      description: "2-4 hours per day",
      icon: <Clock className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "full-time-stay",
      title: "Full-time Stay",
      description: "24-hour live-in care",
      icon: <User className="w-8 h-8 text-blue-500" />,
    },
  ];

  const handleCaregiverSelect = (caregiverId: string) => {
    setSelectedCaregiverType(caregiverId);
  };

  const handleDurationSelect = (durationId: string) => {
    setSelectedDuration(durationId);
  };

  const handlePatientDataChange = (
    field: keyof PatientFormData,
    value: string
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotal = () => {
    const selectedCaregiver = caregiverTypes.find(
      (c) => c.id === selectedCaregiverType
    );
    if (!selectedCaregiver) return 0;

    const rate =
      selectedDuration === "daily-visits"
        ? selectedCaregiver.dailyRate
        : selectedCaregiver.fullTimeRate;
    return rate * 30; // 30 days
  };

  const getSelectedCaregiverName = () => {
    const caregiver = caregiverTypes.find(
      (c) => c.id === selectedCaregiverType
    );
    return caregiver?.title || "";
  };

  const getSelectedDurationName = () => {
    const duration = careDurations.find((d) => d.id === selectedDuration);
    return duration?.title || "";
  };

  const showPatientSection = selectedCaregiverType && selectedDuration;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center">
            <Heart className="w-6 h-6 text-green-500 mr-2" />
            <div>
              <span className="text-xl font-medium text-gray-700">
                Caregiver Services
              </span>
              <p className="text-sm text-gray-500">
                Professional care for your loved ones
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Select Caregiver Type */}
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Heart className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">Select Caregiver Type</h2>
              </div>
              <p className="text-sm opacity-90">
                Choose the type of caregiver that best fits your needs
              </p>
            </div>

            <div className="space-y-4">
              {caregiverTypes.map((caregiver) => (
                <div
                  key={caregiver.id}
                  className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    selectedCaregiverType === caregiver.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => handleCaregiverSelect(caregiver.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {caregiver.title}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {caregiver.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {caregiver.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₦{caregiver.dailyRate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Daily Rate</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Full-time: ₦{caregiver.fullTimeRate.toLocaleString()}
                        /day
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {caregiver.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-600"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Select Care Duration */}
            {selectedCaregiverType && (
              <>
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">
                      Select Care Duration
                    </h2>
                  </div>
                  <p className="text-sm opacity-90">
                    Choose how often you need caregiver services
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careDurations.map((duration) => (
                    <div
                      key={duration.id}
                      className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all text-center ${
                        selectedDuration === duration.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleDurationSelect(duration.id)}
                    >
                      <div className="flex justify-center mb-3">
                        {duration.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {duration.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {duration.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Patient Information */}
            {showPatientSection && (
              <>
                <div className="bg-purple-500 text-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">
                      Patient Information
                    </h2>
                  </div>
                  <p className="text-sm opacity-90">
                    Provide details about the patient needing care
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={patientData.patientName}
                        onChange={(e) =>
                          handlePatientDataChange("patientName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Age
                      </label>
                      <input
                        type="text"
                        placeholder="Age"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={patientData.patientAge}
                        onChange={(e) =>
                          handlePatientDataChange("patientAge", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Condition/Reason for Care
                    </label>
                    <textarea
                      placeholder="Describe the patient's condition or reason for needing care"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                      value={patientData.medicalCondition}
                      onChange={(e) =>
                        handlePatientDataChange(
                          "medicalCondition",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Care Location
                      </label>
                      <input
                        type="text"
                        placeholder="Full address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={patientData.careLocation}
                        onChange={(e) =>
                          handlePatientDataChange(
                            "careLocation",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={patientData.startDate}
                        onChange={(e) =>
                          handlePatientDataChange("startDate", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      placeholder="Name and phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={patientData.emergencyContact}
                      onChange={(e) =>
                        handlePatientDataChange(
                          "emergencyContact",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="Any special needs or requirements"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 resize-none"
                      value={patientData.specialRequirements}
                      onChange={(e) =>
                        handlePatientDataChange(
                          "specialRequirements",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    Book Caregiver Service
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Booking Summary */}
          {showPatientSection && (
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4 rounded-t-xl">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  <h3 className="font-semibold text-lg">Booking Summary</h3>
                </div>
              </div>

              <div className="bg-gray-50 rounded-b-xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500 font-medium">
                      Caregiver Type:
                    </span>
                    <div className="font-semibold text-gray-900 text-right">
                      {getSelectedCaregiverName()}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500 font-medium">
                      Duration:
                    </span>
                    <div className="font-semibold text-gray-900 text-right">
                      {getSelectedDurationName()}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-500 font-medium">
                      Period:
                    </span>
                    <div className="font-semibold text-gray-900 text-right">
                      30 days
                    </div>
                  </div>

                  <div className="flex justify-between items-start pt-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <div className="text-2xl font-bold text-purple-600">
                      ₦{calculateTotal().toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-6 bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">
                      What's Included:
                    </h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Professional caregiver assignment
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        24/7 support hotline
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Regular progress reports
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Emergency response protocol
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverServicesBooking;
