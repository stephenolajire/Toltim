import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  HeartHandshake,
  CheckCircle,
  FileText,
  User,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCHWProcedures } from "../constant/GlobalContext";
import { toast } from "react-toastify";
import Loading from "../components/common/Loading";
import Error from "../components/Error";
import api from "../constant/api";

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
  careAddress: string;
  startDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  specialRequirements: string;
  period: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const CaregiverBooking: React.FC = () => {
  const { data: caregiver, isLoading, error } = useCHWProcedures();

  // Location states
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Transform API data to match CaregiverType interface
  const caregiverTypes: CaregiverType[] =
    caregiver?.results?.map((item: any) => {
      const isNurse = item.slug === "nurse";
      const features =
        typeof item.features === "string"
          ? item.features.split(",").map((f: string) => f.trim())
          : item.features;

      return {
        id: item.slug,
        name: item.name,
        label: isNurse ? "Medical Expert" : "Community Care",
        description: item.short_description,
        dailyRate: parseFloat(item.daily_rate),
        fullTimeRate: parseFloat(item.full_time_rate),
        icon: isNurse ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        ) : (
          <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        ),
        features: features,
      };
    }) || [];

  const [bookingData, setBookingData] = useState<BookingData>({
    caregiverType: null,
    duration: "daily",
    patientName: "",
    patientAge: "",
    medicalCondition: "",
    careLocation: "",
    careAddress: "",
    startDate: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    specialRequirements: "",
    period: 30,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    try {
      // Check current permission status
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log("Current geolocation permission:", permission.state);

        // If permission is denied, we still try to request it
        // The browser will show the permission prompt again
        if (permission.state === "denied") {
          console.log(
            "Permission was denied, but attempting to request again..."
          );
        }
      }

      // Always attempt to get location - this will trigger permission prompt if needed
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLocationLoading(false);

          // Store in localStorage for use in other components
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location access and try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = `Unknown error occurred (${error.code})`;
          }

          setLocationError(errorMessage);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0, // Changed to 0 to always get fresh location and trigger permission prompt
        }
      );
    } catch (error) {
      console.error("Permission query error:", error);
      // Fallback: still try to get location even if permission query fails
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLocationLoading(false);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Unable to get your location. Please enable location access."
          );
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  };

  const handleBooking = async () => {
    if (
      !bookingData.caregiverType ||
      !bookingData.patientName ||
      !bookingData.careLocation ||
      !bookingData.startDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!location) {
      toast.error("Location not available. Please enable location access.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        caregiver_type: bookingData.caregiverType.id, // "nurse" or "chw"
        duration:
          bookingData.duration === "daily" ? "daily_visits" : "full_time",
        patient_name: bookingData.patientName,
        patient_age: parseInt(bookingData.patientAge) || 0,
        medical_condition: bookingData.medicalCondition,
        care_location: bookingData.careLocation,
        care_address: bookingData.careAddress,
        start_date: bookingData.startDate,
        emergency_contact_name: bookingData.emergencyContactName,
        emergency_contact_phone: bookingData.emergencyContactPhone,
        special_requirements: bookingData.specialRequirements,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await api.post("/caregiver-booking/", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Booking confirmed successfully!");
        navigate("/patient");
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to complete booking. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaregiverSelect = (caregiver: CaregiverType) => {
    setBookingData((prev) => ({
      ...prev,
      caregiverType: caregiver,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

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

          {/* Location Status Banner */}
          {locationLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700">Getting your location...</span>
            </div>
          )}

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 font-medium">Location Error</p>
                <p className="text-red-600">{locationError}</p>
                <button
                  onClick={getCurrentLocation}
                  className="mt-2 text-red-700 underline hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {location && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-sm">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="text-green-700">
                Location detected: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </span>
            </div>
          )}
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
              {caregiverTypes.length > 0 ? (
                caregiverTypes.map(renderCaregiverCard)
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">
                    No caregivers available at the moment
                  </p>
                </div>
              )}
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
                        Patient Name <span className="text-red-500">*</span>
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
                        type="number"
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
                        Care Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="City or area"
                        value={bookingData.careLocation}
                        onChange={(e) =>
                          handleInputChange("careLocation", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
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
                      Full Care Address
                    </label>
                    <input
                      type="text"
                      placeholder="Complete address with street, house number, etc."
                      value={bookingData.careAddress}
                      onChange={(e) =>
                        handleInputChange("careAddress", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={bookingData.emergencyContactName}
                        onChange={(e) =>
                          handleInputChange(
                            "emergencyContactName",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={bookingData.emergencyContactPhone}
                        onChange={(e) =>
                          handleInputChange(
                            "emergencyContactPhone",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
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
                      onClick={handleBooking}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        !bookingData.patientName ||
                        !bookingData.careLocation ||
                        !bookingData.startDate ||
                        !location ||
                        isSubmitting
                      }
                    >
                      {isSubmitting
                        ? "Processing..."
                        : "Book Caregiver Service"}
                    </button>

                    {!location && (
                      <p className="text-xs text-red-600 text-center">
                        Location required to book service
                      </p>
                    )}
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
