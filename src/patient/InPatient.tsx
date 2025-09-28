import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Calendar,
  FileText,
  Shield,
  Loader2,
} from "lucide-react";
import { useInBedProcedures } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import api from "../constant/api";

// Types
interface DefaultService {
  id: string;
  name: string;
  included: boolean;
  isDefault: true;
}

interface FetchedService {
  id: string;
  code: string;
  name: string;
  description: string;
  price_per_day: string;
  is_active: boolean;
  included: boolean;
  notes: string;
  isDefault: false;
}

type ServiceOption = DefaultService | FetchedService;

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
}

const InPatientCaregiverService: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    patientName: "",
    hospitalName: "",
    hospitalAddress: "",
    roomWardNumber: "",
    admissionDate: "",
    expectedDischarge: "",
    numberOfDays: "",
    services: [
      {
        id: "running-errands",
        name: "Running errands (pharmacy, food, etc.)",
        included: true,
        isDefault: true,
      },
      {
        id: "personal-care",
        name: "Personal care assistance",
        included: true,
        isDefault: true,
      },
      {
        id: "companionship",
        name: "Companionship and emotional support",
        included: true,
        isDefault: true,
      },
      {
        id: "family-updates",
        name: "Family communication updates",
        included: true,
        isDefault: true,
      },
    ],
    specialRequirements: "",
  });

  const { data: inBedProceduresData, isLoading } = useInBedProcedures();

  // Merge default services with fetched services
  React.useEffect(() => {
    if (inBedProceduresData?.results) {
      const fetchedServices: FetchedService[] = inBedProceduresData.results
        .filter((procedure: any) => procedure.is_active)
        .map((procedure: any) => ({
          id: procedure.id,
          code: procedure.code,
          name: procedure.name,
          description: procedure.description,
          price_per_day: procedure.price_per_day,
          is_active: procedure.is_active,
          included: false,
          notes: "",
          isDefault: false,
        }));

      setBookingData((prev) => ({
        ...prev,
        services: [
          ...prev.services.filter(
            (service) => "isDefault" in service && service.isDefault
          ),
          ...fetchedServices,
        ],
      }));
    }
  }, [inBedProceduresData]);

  if (isLoading) {
    return <Loading />;
  }

  const baseDailyRate = 5000;

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
        service.id === serviceId && !service.isDefault
          ? { ...service, included: !service.included }
          : service
      ),
    }));
  };

  const handleServiceNotesChange = (serviceId: string, notes: string) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
        service.id === serviceId && !service.isDefault
          ? { ...service, notes }
          : service
      ),
    }));
  };

  const calculateDailyRate = () => {
    const additionalServices = bookingData.services
      .filter((service) => service.included && !service.isDefault)
      .reduce((total, service) => {
        if (!service.isDefault) {
          return total + parseFloat((service as FetchedService).price_per_day);
        }
        return total;
      }, 0);

    return baseDailyRate + additionalServices;
  };

  const isFormValid = () => {
    return (
      bookingData.patientName &&
      bookingData.hospitalName &&
      bookingData.hospitalAddress &&
      bookingData.roomWardNumber &&
      bookingData.admissionDate &&
      bookingData.expectedDischarge &&
      bookingData.numberOfDays
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);

    try {
      // Prepare items array with selected services
      const items = bookingData.services
        .filter((service) => service.included)
        .map((service) => ({
          service: service.name,
          notes: !service.isDefault ? service.notes : "",
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
      };

      const response = await api.post("inpatient-caregiver/bookings/", payload);

      console.log("Booking created successfully:", response.data);
      alert("Booking request submitted successfully!");

      // Reset form or redirect as needed
      // You might want to redirect to a success page or reset the form
    } catch (error: any) {
      console.error("Error creating booking:", error);

      if (error.response?.data) {
        console.error("Server error:", error.response.data);
        alert(
          `Error: ${error.response.data.message || "Failed to submit booking"}`
        );
      } else {
        alert("Network error: Please check your connection and try again");
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
                      Hospital Address
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
                      Room/Ward Number
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
                      Admission Date
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
                      Expected Discharge
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

              {/* Services Needed */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Services Needed
                  </h3>
                </div>

                {/* Default Services */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Included Services (Cannot be changed)
                  </h4>
                  <div className="space-y-2">
                    {bookingData.services
                      .filter((service) => service.isDefault)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={true}
                              disabled={true}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded"
                            />
                            <span className="text-sm sm:text-base text-gray-700">
                              {service.name}
                            </span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">
                            Included
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Additional Services (Optional)
                  </h4>
                  <div className="space-y-3">
                    {bookingData.services
                      .filter((service) => !service.isDefault)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="border border-gray-200 rounded-lg p-3"
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
                              +₦
                              {parseFloat(
                                (service as FetchedService).price_per_day
                              ).toLocaleString()}
                              /day
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 ml-7 mb-2">
                            {(service as FetchedService).description}
                          </p>

                          {service.included && (
                            <div className="ml-7">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Special notes for this service:
                              </label>
                              <input
                                type="text"
                                value={(service as FetchedService).notes}
                                onChange={(e) =>
                                  handleServiceNotesChange(
                                    service.id,
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Any specific instructions..."
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
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
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Base daily rate:</span>
                  <span className="font-semibold text-gray-900">
                    ₦{baseDailyRate.toLocaleString()}
                  </span>
                </div>

                {/* Additional services breakdown */}
                {bookingData.services
                  .filter((service) => !service.isDefault && service.included)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{service.name}:</span>
                      <span className="text-gray-900">
                        +₦
                        {parseFloat(
                          (service as FetchedService).price_per_day
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span className="text-gray-900">Daily rate:</span>
                    <span className="text-green-600">
                      ₦{calculateDailyRate().toLocaleString()}
                    </span>
                  </div>
                </div>
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
