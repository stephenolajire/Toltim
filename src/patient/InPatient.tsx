import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  FileText,
  Shield,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useInBedProcedures } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import api from "../constant/api";
import { toast } from "react-toastify";
import Error from "../components/Error";

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
}

const InPatientCaregiverService: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
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
  });

  // Load coordinates from localStorage on mount
  useEffect(() => {
    getUserLocation()
  }, []);

  const getUserLocation = () => {
    setLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoordinates({
          latitude: lat,
          longitude: lng,
        });

        localStorage.setItem("latitude", lat.toString());
        localStorage.setItem("longitude", lng.toString());

        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setLoadingLocation(false);
        console.error("Error getting location:", error);
      }
    );
  };

  const { data: inBedProceduresData, isLoading: proceduresLoading } =
    useInBedProcedures();

  const {
    data: nearByCHWData,
    isLoading: chwLoading,
    error: chwError,
  } = useQuery({
    queryKey: ["nearByCHW", coordinates.latitude, coordinates.longitude],
    queryFn: async () => {
      const response = await api.get(
        `inpatient-caregiver/nearby-workers/?role=chw&latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
      );
      // console.log(response.data)
      return response.data;
    },
    enabled: !!coordinates.latitude && !!coordinates.longitude,
    staleTime: 20 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  console.log(nearByCHWData)

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

  if (chwError) {
    return <Error />;
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
      hasSelectedService
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill all required fields and select a CHW");
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
      };

      const response = await api.post("inpatient-caregiver/bookings/", payload);

      console.log("Booking created successfully:", response.data);
      toast.success("Booking request submitted successfully!");
    } catch (error: any) {
      console.error("Error creating booking:", error);

      if (error.response?.data) {
        console.error("Server error:", error.response.data);
        toast.error(
          `Error: ${error.response.data.message || "Failed to submit booking"}`
        );
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
                In-Patient Caregiver Service
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Get dedicated support during your hospital stay with our
                Community Health Workers
              </p>
            </div>
          </div>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{locationError}</p>
            <button
              onClick={getUserLocation}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Book In-Patient Care Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Book In-Patient Care
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Fill in the details to request a Community Health Worker for
                  hospital support
                </p>
              </div>

              {/* Patient Information */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Patient Information
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.patientName}
                      onChange={(e) =>
                        handleInputChange("patientName", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter patient's full name"
                    />
                  </div>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Hospital Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.hospitalName}
                      onChange={(e) =>
                        handleInputChange("hospitalName", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g., Lagos University Teaching Hospital"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.hospitalAddress}
                      onChange={(e) =>
                        handleInputChange("hospitalAddress", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Full hospital address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room/Ward Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.roomWardNumber}
                      onChange={(e) =>
                        handleInputChange("roomWardNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="e.g., Ward 3B, Room 205"
                    />
                  </div>
                </div>
              </div>

              {/* Service Duration */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Service Duration
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admission Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingData.admissionDate}
                      onChange={(e) =>
                        handleInputChange("admissionDate", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Discharge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={bookingData.expectedDischarge}
                      onChange={(e) =>
                        handleInputChange("expectedDischarge", e.target.value)
                      }
                      className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={bookingData.numberOfDays}
                    onChange={(e) =>
                      handleInputChange("numberOfDays", e.target.value)
                    }
                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="How many days do you need care?"
                    min="1"
                  />
                </div>
              </div>

              {/* Services Available */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Available Services <span className="text-red-500">*</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {bookingData.services.length > 0 ? (
                    bookingData.services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={service.id}
                              checked={service.included}
                              onChange={() => handleServiceToggle(service.id)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label
                              htmlFor={service.id}
                              className="text-sm sm:text-base text-gray-700 cursor-pointer font-medium"
                            >
                              {service.name}
                            </label>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ₦
                            {parseFloat(service.price_per_day).toLocaleString()}
                            /day
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 ml-7">
                          {service.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No services available at the moment.</p>
                      <p className="text-sm">
                        Please contact support for assistance.
                      </p>
                    </div>
                  )}
                </div>

                {bookingData.services.length > 0 &&
                  !bookingData.services.some((service) => service.included) && (
                    <p className="text-sm text-red-600 mt-2">
                      Please select at least one service to continue.
                    </p>
                  )}
              </div>

              {/* Select CHW */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Select Community Health Worker{" "}
                    <span className="text-red-500">*</span>
                  </h3>
                </div>

                {chwLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      Loading available CHWs...
                    </p>
                  </div>
                ) : nearByCHWData?.results?.length > 0 ? (
                  <div className="grid gap-3">
                    {nearByCHWData.results.map((chw: CHWWorker) => (
                      <div
                        key={chw.user}
                        onClick={() => handleCHWSelect(chw.user)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedCHW === chw.user
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            {chw.profile_picture ? (
                              <img
                                src={chw.profile_picture}
                                alt={chw.full_name}
                                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
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
                                <p className="font-medium text-gray-900 truncate">
                                  {chw.full_name}
                                </p>
                                {chw.verified_chw && (
                                  <div className="flex-shrink-0">
                                    <CheckCircle
                                      className="w-4 h-4 text-blue-500"
                                      // title="Verified CHW"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Specialization */}
                              {chw.specialization && (
                                <p className="text-xs text-gray-600 mb-1 capitalize">
                                  Specialization: {chw.specialization}
                                </p>
                              )}

                              {/* Experience */}
                              {chw.years_of_experience && (
                                <p className="text-xs text-gray-600 mb-1">
                                  {chw.years_of_experience}{" "}
                                  {chw.years_of_experience === 1
                                    ? "year"
                                    : "years"}{" "}
                                  of experience
                                </p>
                              )}

                              {/* Distance */}
                              {chw.distance !== undefined && (
                                <p className="text-xs text-gray-500">
                                  {chw.distance.toFixed(1)} km away
                                </p>
                              )}
                            </div>
                          </div>

                          {selectedCHW === chw.user && (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        {/* Biography */}
                        {chw.biography && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {chw.biography}
                            </p>
                          </div>
                        )}

                        {/* Availability Badge */}
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              chw.available
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                chw.available ? "bg-green-500" : "bg-gray-500"
                              }`}
                            ></span>
                            {chw.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No CHWs available in your area.</p>
                    <p className="text-sm">
                      Please try again later or contact support.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements or Notes
                </label>
                <textarea
                  value={bookingData.specialRequirements}
                  onChange={(e) =>
                    handleInputChange("specialRequirements", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Any specific needs or instructions for the caregiver..."
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base flex items-center justify-center gap-2 ${
                  isFormValid() && !isSubmitting
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </div>

          {/* Pricing Summary & What to Expect */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Pricing Summary
                </h3>
              </div>

              <div className="space-y-3">
                {bookingData.services
                  .filter((service) => service.included)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{service.name}:</span>
                      <span className="text-gray-900">
                        ₦{parseFloat(service.price_per_day).toLocaleString()}
                        /day
                      </span>
                    </div>
                  ))}

                {bookingData.services.some((service) => service.included) ? (
                  <>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-900">Daily rate:</span>
                        <span className="text-gray-900">
                          ₦{calculateDailyRate().toLocaleString()}
                        </span>
                      </div>
                      {bookingData.numberOfDays && (
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-gray-900">Number of days:</span>
                          <span className="text-gray-900">
                            {bookingData.numberOfDays}
                          </span>
                        </div>
                      )}
                    </div>
                    {bookingData.numberOfDays && (
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-base sm:text-lg font-semibold">
                          <span className="text-gray-900">Total cost:</span>
                          <span className="text-green-600">
                            ₦{calculateTotalCost().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Select services to see pricing</p>
                  </div>
                )}
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  What to Expect
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Caregiver matching within 2 hours
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Verified Community Health Workers
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">
                    24/7 support available
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-700">
                    Daily progress updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InPatientCaregiverService;
