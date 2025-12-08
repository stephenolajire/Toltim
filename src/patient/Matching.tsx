// HealthPractitionersMatching.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import api from "../constant/api";
import PractitionerCard from "./components/PractitionerCard";
import ScheduleConfigComponent from "./components/ScheduleConfigComponent";
import TimeSelection from "./components/TimeSelection";
import Booking from "./components/Booking";
import type {
  Service,
  Practitioner,
  ScheduleConfig,
  BookingDetails,
} from "./components/types";
import { toast } from "react-toastify";

interface SelectedServiceFromStorage {
  service: Service;
  days: number;
  totalAmount: number;
}

interface HealthPractitionersMatchingProps {
  services?: Service[]; // Make it optional since we'll get from localStorage
}

const HealthPractitionersMatching: React.FC<
  HealthPractitionersMatchingProps
> = ({ services: propServices = [] }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<
    "practitioners" | "schedule-config" | "scheduling" | "booking"
  >("practitioners");

  // State for selected services from localStorage
  const [selectedServices, setSelectedServices] = useState<
    SelectedServiceFromStorage[]
  >([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] =
    useState<Practitioner | null>(null);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    frequency: "daily",
    selectedDays: [],
    startDate: "",
    timeSlot: "",
    totalDays: 1,
  });
  const [bookingForSelf, setBookingForSelf] = useState<boolean | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    relationship: "",
    testResult: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  console.log(locationError);
  console.log(loadingLocation);

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
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setLoadingLocation(false);
        console.error("Error getting location:", error);
      }
    );
  };

  // Load selected services from localStorage on component mount
  useEffect(() => {
    getUserLocation();
    const storedServices = localStorage.getItem("selectedServices");
    if (storedServices) {
      try {
        const parsedServices: SelectedServiceFromStorage[] =
          JSON.parse(storedServices);
        setSelectedServices(parsedServices);

        if (parsedServices.length > 0) {
          setSelectedService(parsedServices[0].service);
        }
      } catch (error) {
        console.error("Error parsing selected services:", error);
        if (propServices.length > 0) {
          setSelectedService(propServices[0]);
        }
      }
    } else if (propServices.length > 0) {
      setSelectedService(propServices[0]);
    } else {
      alert("No services selected. Please select services first.");
      navigate(-1);
      return;
    }

    const storedDays = localStorage.getItem("procedureDays");
    const totalDays = storedDays ? parseInt(storedDays) : 1;
    setScheduleConfig((prev) => ({ ...prev, totalDays }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 run only once

  // Fetch nearby health practitioners using TanStack Query
  const {
    data: practitioners = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "nearbyPractitioners",
      coordinates.latitude,
      coordinates.longitude,
    ],
    queryFn: async () => {
      const res = await api.get(
        `/services/nurses/nearby/?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&specialization=${selectedService?.specialization}`
      );
      console.log("NURSES NEARBY RESPONSE:", res.data);

      return res.data.results || [];
    },
    enabled:
      !!selectedService &&
      coordinates.latitude !== null &&
      coordinates.longitude !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const filteredPractitioners = practitioners.filter((practitioner: any) => {
    const name = practitioner?.full_name;
    const searchLower = searchTerm.toLowerCase();

    // Handle specialization as an array of objects with {id, name}
    const specializationMatch = Array.isArray(practitioner?.specialization)
      ? practitioner.specialization.some((spec: any) => {
          // Check if spec is an object with a name property
          if (typeof spec === "object" && spec !== null && spec.name) {
            return spec.name.toLowerCase().includes(searchLower);
          }
          // Fallback for string format (if API changes)
          if (typeof spec === "string") {
            return spec.toLowerCase().includes(searchLower);
          }
          return false;
        })
      : false;

    // Search in services array (these are strings)
    const servicesMatch = Array.isArray(practitioner?.services)
      ? practitioner.services.some((service: string) =>
          service.toLowerCase().includes(searchLower)
        )
      : false;

    return name.includes(searchLower) || specializationMatch || servicesMatch;
  });
  const handlePractitionerSelect = (practitioner: Practitioner) => {
    setSelectedPractitioner(practitioner);
    console.log(selectedPractitioner);
    setCurrentStep("schedule-config");
  };

  const handleScheduleConfigComplete = () => {
    setCurrentStep("scheduling");
  };

  const handleTimeSlotSelect = (time: string) => {
    setScheduleConfig((prev) => ({ ...prev, timeSlot: time }));
  };

  const handleProceedToBooking = () => {
    setCurrentStep("booking");
  };

  if (error) {
    console.error("Error fetching practitioners:", error);
  }

  const handleBookingSubmit = async () => {
    try {
      // Create FormData instance
      const formData = new FormData();

      // Add all fields to FormData
      formData.append("nurse", selectedPractitioner?.user_id || "");
      formData.append("nurse_id", selectedPractitioner?.user_id || "");
      formData.append("scheduling_option", scheduleConfig.frequency);
      formData.append("start_date", scheduleConfig.startDate);
      formData.append("time_of_day", scheduleConfig.timeSlot);
      formData.append("is_for_self", String(bookingForSelf));
      formData.append("latitude", String(coordinates.latitude!));
      formData.append("longitude", String(coordinates.longitude!));
      formData.append("service_address", bookingDetails.address || "");

      // Add test_result file if it exists
      if (bookingDetails.testResult) {
        formData.append("test_result", bookingDetails.testResult);
      }

      // Add procedure_item as JSON string
      formData.append(
        "procedure_id",
        String(selectedService?.id)
      );
      formData.append(
        "num_days",
        String(scheduleConfig.totalDays)
      );

      // Handle selected_days based on frequency
      if (scheduleConfig.frequency === "daily") {
        // For daily frequency, calculate consecutive days starting from start_date
        const allDays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const startDate = new Date(scheduleConfig.startDate);
        const startDayIndex = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const daysToSend = [];
        for (let i = 0; i < scheduleConfig.totalDays; i++) {
          const dayIndex = (startDayIndex + i) % 7; // Wrap around the week
          daysToSend.push(allDays[dayIndex]);
        }

        // Remove duplicates and append to formData
        const uniqueDays = [...new Set(daysToSend)];
        uniqueDays.forEach((day) => {
          formData.append("selected_days", day);
        });
      } else if (scheduleConfig.selectedDays.length > 0) {
        // For specific days, capitalize and send each day
        const capitalizedDays = scheduleConfig.selectedDays.map(
          (day) => day.charAt(0).toUpperCase() + day.slice(1)
        );
        capitalizedDays.forEach((day) => {
          formData.append("selected_days", day);
        });
      } else {
        // Fallback: send at least one day (e.g., the start date's day)
        const startDateDay = new Date(
          scheduleConfig.startDate
        ).toLocaleDateString("en-US", { weekday: "long" });
        formData.append("selected_days", startDateDay);
      }

      // Add patient_detail
      if (bookingForSelf) {
        formData.append("patient_detail", "null");
      } else {
        formData.append(
          "patient_detail",
          JSON.stringify({
            first_name: bookingDetails.firstName,
            last_name: bookingDetails.lastName,
            email: bookingDetails.email,
            phone_number: bookingDetails.phone,
            address: bookingDetails.address,
            relationship_to_patient: bookingDetails.relationship,
          })
        );
      }

      console.log("Booking Data to be sent (FormData):");
      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Make the API call
      const response = await api.post(
        "services/nurse-procedure-bookings/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Booking response:", response.data);

      toast.success("Appointment(s) booked successfully!");
      navigate("/patient");
    } catch (error: any) {
      console.error("Booking failed:", error);

      // Handle specific error responses
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          "Booking failed";

        // Log detailed errors if available
        if (error.response.data?.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }

        toast.error(`Booking failed: ${errorMessage}`);
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("Booking failed. Please try again.");
      }
    }
  };

  const handleBackNavigation = () => {
    if (currentStep === "schedule-config") {
      setCurrentStep("practitioners");
    } else if (currentStep === "scheduling") {
      setCurrentStep("schedule-config");
    } else if (currentStep === "booking") {
      setCurrentStep("scheduling");
    } else {
      window.history.back();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "practitioners":
        return "Available Healthcare Providers";
      case "schedule-config":
        return "Configure Schedule";
      case "scheduling":
        return "Select Time";
      case "booking":
        return "Complete Booking";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "practitioners":
        return "Select from our verified healthcare providers";
      case "schedule-config":
        return "Configure your appointment frequency and timing";
      case "scheduling":
        return "Choose your preferred time slot";
      case "booking":
        return "Provide booking details to confirm your appointment(s)";
      default:
        return "";
    }
  };

  // Show loading state if selectedService is not loaded yet
  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading selected services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackNavigation}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getStepTitle()}
              </h1>
              <p className="text-gray-600">{getStepDescription()}</p>
              {scheduleConfig.totalDays > 1 && (
                <p className="text-blue-600 text-sm mt-1">
                  Treatment plan: {scheduleConfig.totalDays} days
                </p>
              )}
              {/* Show selected services summary */}
              {selectedServices.length > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  Selected services:{" "}
                  {selectedServices.map((s) => s.service.name).join(", ")}
                </div>
              )}
            </div>
          </div>

          {currentStep === "practitioners" && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentStep === "practitioners" && (
            <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading healthcare providers...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 text-lg mb-2">
                    Failed to load healthcare providers
                  </p>
                  <p className="text-gray-400 text-sm">
                    Please check your internet connection and try again
                  </p>
                </div>
              ) : filteredPractitioners.length > 0 ? (
                filteredPractitioners.map((practitioner: any) => (
                  <PractitionerCard
                    key={practitioner.id}
                    practitioner={practitioner}
                    onSelect={handlePractitionerSelect}
                  />
                ))
              ) : practitioners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No healthcare providers found in your area
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try expanding your search radius
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No healthcare providers match your search
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === "schedule-config" && selectedPractitioner && (
            <ScheduleConfigComponent
              selectedPractitioner={selectedPractitioner}
              selectedService={selectedService}
              scheduleConfig={scheduleConfig}
              onScheduleConfigChange={setScheduleConfig}
              onBack={() => setCurrentStep("practitioners")}
              onContinue={handleScheduleConfigComplete}
            />
          )}

          {currentStep === "scheduling" && selectedPractitioner && (
            <TimeSelection
              selectedPractitioner={selectedPractitioner}
              selectedService={selectedService}
              scheduleConfig={scheduleConfig}
              onTimeSlotSelect={handleTimeSlotSelect}
              onBack={() => setCurrentStep("schedule-config")}
              onContinue={handleProceedToBooking}
            />
          )}

          {currentStep === "booking" && selectedPractitioner && (
            <Booking
              selectedPractitioner={selectedPractitioner}
              selectedService={selectedService}
              scheduleConfig={scheduleConfig}
              bookingForSelf={bookingForSelf}
              bookingDetails={bookingDetails}
              loading={loading}
              onBookingForSelfChange={setBookingForSelf}
              onBookingDetailsChange={setBookingDetails}
              onBack={() => setBookingForSelf(null)}
              onSubmit={handleBookingSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthPractitionersMatching;
