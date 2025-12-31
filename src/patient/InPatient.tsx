import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  FileText,
  Shield,
  Loader2,
  CheckCircle,
  Heart,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useInBedProcedures } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import api from "../constant/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Types
interface ServiceOption {
  id: string;
  code: string;
  name: string;
  description: string;
  price_per_day: string;
  is_active: boolean;
  included: boolean;
}

interface CHWWorker {
  id: string;
  user: string;
  full_name: string;
  profile_picture: string | null;
  distance: number;
  available: boolean;
  biography: string;
  specialization: string;
  verified_chw: boolean;
  years_of_experience: number;
  location: string;
}

interface BookingData {
  patientName: string;
  hospitalName: string;
  hospitalAddress: string;
  roomWardNumber: string;
  admissionDate: string;
  expectedDischarge: string;
  numberOfDays: string;
  services: ServiceOption[];
  specialRequirements: string;
  chw: string;
  start_date: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const InPatientCaregiverService: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showFloatingSummary, setShowFloatingSummary] = useState(false);

  // Updated location state to match first component
  const [location, setLocation] = useState<LocationData | null>(null);

  const [selectedCHW, setSelectedCHW] = useState<string>("");

  const [bookingData, setBookingData] = useState<BookingData>({
    patientName: "",
    hospitalName: "",
    hospitalAddress: "",
    roomWardNumber: "",
    admissionDate: "",
    expectedDischarge: "",
    numberOfDays: "",
    services: [],
    specialRequirements: "",
    chw: "",
    start_date: "",
  });

  // Load location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Add scroll listener for floating summary
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingSummary(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated location function to match first component
  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLoadingLocation(false);
      return;
    }

    try {
      // Check current permission status
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log("Current geolocation permission:", permission.state);

        if (permission.state === "denied") {
          console.log(
            "Permission was denied, but attempting to request again..."
          );
        }
      }

      // Always attempt to get location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLoadingLocation(false);

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
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error("Permission query error:", error);
      // Fallback
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("Location obtained:", locationData);
          setLocation(locationData);
          setLoadingLocation(false);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Unable to get your location. Please enable location access."
          );
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  };

  const { data: inBedProceduresData, isLoading: proceduresLoading } =
    useInBedProcedures();

  const navigate = useNavigate();

  const {
    data: nearByCHWData,
    isLoading: chwLoading,
    error: chwError,
  } = useQuery({
    queryKey: ["nearByCHW", location?.latitude, location?.longitude],
    queryFn: async () => {
      const response = await api.get(
        `inpatient-caregiver/nearby-workers/?role=chw&latitude=${location?.latitude}&longitude=${location?.longitude}`
      );
      return response.data;
    },
    enabled: !!location?.latitude && !!location?.longitude,
    staleTime: 20 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  console.log(nearByCHWData);

  // Load fetched services
  useEffect(() => {
    if (inBedProceduresData?.results) {
      const fetchedServices: ServiceOption[] = inBedProceduresData.results
        .filter((procedure: any) => procedure.is_active)
        .map((procedure: any) => ({
          id: procedure.id,
          code: procedure.code,
          name: procedure.name,
          description: procedure.description,
          price_per_day: procedure.price_per_day,
          is_active: procedure.is_active,
          included: false,
        }));

      setBookingData((prev) => ({
        ...prev,
        services: fetchedServices,
      }));
    }
  }, [inBedProceduresData]);

  if (proceduresLoading || loadingLocation) {
    return <Loading />;
  }

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId
          ? { ...service, included: !service.included }
          : service
      ),
    }));

    // Show toast on small devices
    const service = bookingData.services.find((s) => s.id === serviceId);
    if (service && window.innerWidth < 640) {
      const isNowIncluded = !service.included;
      const updatedServices = bookingData.services.map((s) =>
        s.id === serviceId ? { ...s, included: isNowIncluded } : s
      );
      const newDailyRate = updatedServices
        .filter((s) => s.included)
        .reduce((total, s) => total + parseFloat(s.price_per_day), 0);

      toast.info(
        `${isNowIncluded ? "Added" : "Removed"} ${
          service.name
        }. New Daily Rate: ₦${newDailyRate.toLocaleString()}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleCHWSelect = (chwId: string) => {
    setSelectedCHW(chwId);
    setBookingData((prev) => ({
      ...prev,
      chw: chwId,
    }));
  };

  const calculateDailyRate = () => {
    return bookingData.services
      .filter((service) => service.included)
      .reduce((total, service) => {
        return total + parseFloat(service.price_per_day);
      }, 0);
  };

  const calculateTotalCost = () => {
    const dailyRate = calculateDailyRate();
    const days = parseInt(bookingData.numberOfDays) || 0;
    return dailyRate * days;
  };

  const isFormValid = () => {
    const hasSelectedService = bookingData.services.some(
      (service) => service.included
    );
    return (
      bookingData.patientName &&
      bookingData.hospitalName &&
      bookingData.hospitalAddress &&
      bookingData.roomWardNumber &&
      bookingData.admissionDate &&
      bookingData.expectedDischarge &&
      bookingData.numberOfDays &&
      bookingData.chw &&
      hasSelectedService &&
      bookingData.start_date &&
      location // Added location check
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields and select a CHW");
      return;
    }

    if (!location) {
      toast.error("Location not available. Please enable location access.");
      return;
    }

    setIsSubmitting(true);

    try {
      const items = bookingData.services
        .filter((service) => service.included)
        .map((service) => ({
          service: service.code,
          notes: "",
        }));

      // Updated payload with location
      const payload = {
        patient_name: bookingData.patientName,
        hospital_name: bookingData.hospitalName,
        hospital_address: bookingData.hospitalAddress,
        room_ward: bookingData.roomWardNumber,
        admission_date: bookingData.admissionDate,
        expected_discharge: bookingData.expectedDischarge,
        number_of_days: parseInt(bookingData.numberOfDays),
        special_requirements: bookingData.specialRequirements,
        items: items,
        chw: bookingData.chw,
        start_date: bookingData.start_date,
        latitude: location.latitude, // Added latitude
        longitude: location.longitude, // Added longitude
      };

      const response = await api.post("inpatient-caregiver/bookings/", payload);
      console.log("Booking created successfully:", response.data);
      toast.success("Booking request submitted successfully!");
      navigate("/patient/history");
    } catch (error: any) {
      console.error("Error creating booking:", error);

      if (error.response?.data) {
        if (error.response.data.errors?.wallet_balance) {
          toast.error(error.response.data.errors.wallet_balance, {
            position: "top-center",
            autoClose: 5000,
          });
        } else {
          const errorMessage =
            error.response.data.errors?.[0] ||
            error.response.data.message ||
            "An error occurred while processing your request";
          toast.error(errorMessage);
        }
      } else {
        toast.error(
          "Network error: Please check your connection and try again"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="mt-1 sm:mt-0 p-2 text-blue-600 hover:text-blue-700 transition-colors rounded-lg hover:bg-blue-50"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  In-Patient Care Service
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Get dedicated support during your hospital stay with our
                Community Health Workers
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white shadow-lg mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  Professional Healthcare Support
                </h3>
                <p className="text-sm sm:text-base text-blue-50">
                  Our verified Community Health Workers provide compassionate,
                  professional care throughout your hospital stay
                </p>
              </div>
            </div>
          </div>

          {/* Location Status Banner */}
          {loadingLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center gap-3 text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700 font-medium">
                Getting your location...
              </span>
            </div>
          )}

          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 font-semibold">Location Error</p>
                <p className="text-red-600 mt-0.5">{locationError}</p>
                <button
                  onClick={getCurrentLocation}
                  className="mt-2 text-red-700 font-medium underline hover:text-red-800"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {location && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 flex items-center gap-3 text-sm">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Location detected: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Book In-Patient Care Section */}
            <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-4 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Book In-Patient Care
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Fill in the details to request a Community Health Worker for
                  hospital support
                </p>
              </div>

              {/* Patient Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Patient Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.patientName}
                      onChange={(e) =>
                        handleInputChange("patientName", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Enter patient's full name"
                    />
                  </div>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Hospital Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.hospitalName}
                      onChange={(e) =>
                        handleInputChange("hospitalName", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="e.g., Lagos University Teaching Hospital"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Hospital Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.hospitalAddress}
                      onChange={(e) =>
                        handleInputChange("hospitalAddress", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Full hospital address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room/Ward Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.roomWardNumber}
                      onChange={(e) =>
                        handleInputChange("roomWardNumber", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="e.g., Ward 3B, Room 205"
                    />
                  </div>
                </div>
              </div>

              {/* Service Duration */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Service Duration
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admission Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingData.admissionDate}
                      onChange={(e) =>
                        handleInputChange("admissionDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected Discharge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingData.expectedDischarge}
                      onChange={(e) =>
                        handleInputChange("expectedDischarge", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Days <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bookingData.numberOfDays}
                      onChange={(e) =>
                        handleInputChange("numberOfDays", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                      placeholder="How many days?"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingData.start_date}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                      className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Services Available */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Available Services <span className="text-red-500">*</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {bookingData.services.length > 0 ? (
                    bookingData.services.map((service) => (
                      <div
                        key={service.id}
                        className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                          service.included
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="checkbox"
                              id={service.id}
                              checked={service.included}
                              onChange={() => handleServiceToggle(service.id)}
                              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={service.id}
                              className="text-sm sm:text-base text-gray-900 cursor-pointer font-semibold"
                            >
                              {service.name}
                            </label>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            ₦
                            {parseFloat(service.price_per_day).toLocaleString()}
                            /day
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 ml-8">
                          {service.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-semibold">
                        No services available at the moment.
                      </p>
                      <p className="text-sm">
                        Please contact support for assistance.
                      </p>
                    </div>
                  )}
                </div>

                {bookingData.services.length > 0 &&
                  !bookingData.services.some((service) => service.included) && (
                    <div className="flex items-center gap-2 mt-3 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        Please select at least one service to continue.
                      </p>
                    </div>
                  )}
              </div>

              {/* Select CHW */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Select Community Health Worker{" "}
                    <span className="text-red-500">*</span>
                  </h3>
                </div>

                {chwLoading ? (
                  <div className="text-center py-12 bg-blue-50 rounded-xl">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-3" />
                    <p className="text-sm text-gray-600 font-medium">
                      Loading available CHWs...
                    </p>
                  </div>
                ) : nearByCHWData?.results?.length > 0 ? (
                  <div className="grid gap-3">
                    {nearByCHWData.results.map((chw: CHWWorker) => (
                      <div
                        key={chw.user}
                        onClick={() => handleCHWSelect(chw.user)}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selectedCHW === chw.user
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            {chw.profile_picture ? (
                              <img
                                src={chw.profile_picture}
                                alt={chw.full_name}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-200"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="text-white font-bold text-sm sm:text-base">
                                  {chw.full_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-900 truncate">
                                  {chw.full_name}
                                </p>
                                {chw.verified_chw && (
                                  <div className="flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                  </div>
                                )}
                              </div>

                              {chw.specialization && (
                                <p className="text-xs text-gray-600 mb-1 capitalize">
                                  <span className="font-semibold">
                                    Specialization:
                                  </span>{" "}
                                  {chw.specialization}
                                </p>
                              )}

                              {chw.years_of_experience && (
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="font-semibold">
                                    Experience:
                                  </span>{" "}
                                  {chw.years_of_experience}{" "}
                                  {chw.years_of_experience === 1
                                    ? "year"
                                    : "years"}
                                </p>
                              )}

                              {chw.distance !== undefined && (
                                <p className="text-xs text-gray-500">
                                  <MapPin className="w-3 h-3 inline mr-1" />
                                  {chw.distance.toFixed(1)} km away
                                </p>
                              )}
                            </div>
                          </div>

                          {selectedCHW === chw.user && (
                            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        {chw.biography && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {chw.biography}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              chw.available
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full mr-1.5 ${
                                chw.available ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></span>
                            {chw.available ? "Available Now" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chwError ? (
                  <div className="text-center py-12 text-gray-500 bg-red-50 rounded-xl border-2 border-red-200">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <p className="font-semibold text-red-800">
                      Error loading CHWs
                    </p>
                    <p className="text-sm mt-1">
                      Please try again later or contact support.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="font-semibold">
                      No CHWs available in your area.
                    </p>
                    <p className="text-sm">
                      Please try again later or contact support.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requirements or Notes
                </label>
                <textarea
                  value={bookingData.specialRequirements}
                  onChange={(e) =>
                    handleInputChange("specialRequirements", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base resize-none"
                  placeholder="Any specific needs or instructions for the caregiver..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all text-sm sm:text-base flex items-center justify-center gap-2 shadow-md ${
                  isFormValid() && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-200 hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                }`}
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting
                  ? "Submitting Request..."
                  : "Submit Booking Request"}
              </button>
            </div>
          </div>

          {/* Pricing Summary & What to Expect */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5">
            {/* Pricing Summary */}
            <div className="bg-white rounded-xl hidden md:block shadow-md border-2 border-blue-100 p-4 sm:p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Pricing Summary
                </h3>
              </div>

              <div className="space-y-3">
                {bookingData.services
                  .filter((service) => service.included)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between text-sm bg-blue-50 p-3 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium">
                        {service.name}:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ₦{parseFloat(service.price_per_day).toLocaleString()}
                        /day
                      </span>
                    </div>
                  ))}

                {bookingData.services.some((service) => service.included) ? (
                  <>
                    <div className="border-t-2  border-blue-100 pt-4 mt-4">
                      <div className="flex justify-between text-sm mb-3 bg-blue-50 p-3 rounded-lg">
                        <span className="text-gray-700 font-semibold">
                          Daily rate:
                        </span>
                        <span className="text-blue-600 font-bold">
                          ₦{calculateDailyRate().toLocaleString()}
                        </span>
                      </div>
                      {bookingData.numberOfDays && (
                        <div className="flex justify-between text-sm bg-blue-50 p-3 rounded-lg">
                          <span className="text-gray-700 font-semibold">
                            Number of days:
                          </span>
                          <span className="text-gray-900 font-bold">
                            {bookingData.numberOfDays}{" "}
                            {parseInt(bookingData.numberOfDays) === 1
                              ? "day"
                              : "days"}
                          </span>
                        </div>
                      )}
                    </div>
                    {bookingData.numberOfDays && (
                      <div className="border-t-2 border-blue-100 pt-4 mt-4">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold">
                              Total Cost:
                            </span>
                            <span className="text-2xl font-bold">
                              ₦{calculateTotalCost().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">
                      Select services to see pricing
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* What to Expect */}
            {/* <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-4 sm:p-6 text-white">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-blue-500">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold">What to Expect</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium">
                    Caregiver matching within 2 hours
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium">
                    Verified Community Health Workers
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium">
                    24/7 support available
                  </p>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium">
                    Daily progress updates
                  </p>
                </div>
              </div>
            </div> */}

            {/* Help Section */}
            {/* <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-700">
                    Our support team is available 24/7 to assist you with your
                    booking.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Floating Summary - Mobile Only */}
      {bookingData.services.length > 0 &&
        (showFloatingSummary || window.innerWidth < 624) && (
          <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t-2 border-gray-200 shadow-2xl transition-all duration-300">
            <div className="px-4 py-4 max-w-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">Daily Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦
                    {bookingData.services
                      .filter((s) => s.included)
                      .reduce(
                        (total, s) => total + parseFloat(s.price_per_day),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">
                    {bookingData.services.filter((s) => s.included).length}{" "}
                    services
                  </p>
                  <p className="text-sm font-medium text-gray-700">selected</p>
                </div>
              </div>

              <button
                onClick={() => {}}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !bookingData.patientName ||
                  !bookingData.hospitalName ||
                  !bookingData.admissionDate ||
                  !bookingData.numberOfDays ||
                  bookingData.services.filter((s) => s.included).length === 0 ||
                  isSubmitting
                }
              >
                {isSubmitting ? "Processing..." : "Proceed to Booking"}
              </button>
            </div>
          </div>
        )}

      {/* Add padding to prevent content from being hidden behind floating summary */}
      {bookingData.services.length > 0 && showFloatingSummary && (
        <div className="h-32 lg:hidden"></div>
      )}
    </div>
  );
};

export default InPatientCaregiverService;
