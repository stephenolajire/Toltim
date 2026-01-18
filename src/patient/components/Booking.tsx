// Booking.tsx
import React, { useState } from "react";
import { ArrowLeft, User, Users, Calendar } from "lucide-react";
import type {
  Service,
  Practitioner,
  ScheduleConfig,
  BookingDetails,
} from "./types";

interface BookingProps {
  selectedPractitioner: Practitioner;
  selectedService: Service;
  scheduleConfig: ScheduleConfig;
  bookingForSelf: boolean | null;
  bookingDetails: BookingDetails;
  loading: boolean;
  onBookingForSelfChange: (forSelf: boolean) => void;
  onBookingDetailsChange: (details: BookingDetails) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

const Booking: React.FC<BookingProps> = ({
  selectedPractitioner,
  selectedService,
  scheduleConfig,
  bookingForSelf,
  bookingDetails,
  loading,
  onBookingForSelfChange,
  onBookingDetailsChange,
  onBack,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalCost = () => {
    let multiplier = 1;
    if (scheduleConfig.frequency === "daily") {
      multiplier = scheduleConfig.totalDays;
    } else if (scheduleConfig.frequency === "specific-days") {
      const weeksInPeriod = Math.ceil(scheduleConfig.totalDays / 7);
      multiplier = weeksInPeriod * scheduleConfig.selectedDays.length;
    } else if (scheduleConfig.frequency === "every-other-day") {
      multiplier = Math.ceil(scheduleConfig.totalDays / 2);
    } else if (scheduleConfig.frequency === "weekly") {
      multiplier = Math.ceil(scheduleConfig.totalDays / 7);
    }
    return selectedService.price * multiplier;
  };

  const getScheduleDescription = () => {
    const { frequency, selectedDays, totalDays } = scheduleConfig;
    switch (frequency) {
      case "daily":
        return `Daily appointments for ${totalDays} days`;
      case "specific-days":
        return `${selectedDays.join(", ")} each week for ${totalDays} days`;
      case "every-other-day":
        return `Every other day for ${totalDays} days`;
      case "weekly":
        return `Weekly appointments for ${totalDays} days`;
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const updateBookingDetails = (updates: Partial<BookingDetails>) => {
    onBookingDetailsChange({ ...bookingDetails, ...updates });
  };

  const isFormValid = () => {
    if (bookingForSelf === null) return false;

    // For booking for self, only require address
    if (bookingForSelf === true) {
      return bookingDetails.address?.trim() !== "";
    }

    // For booking for someone else, require all fields
    return (
      bookingDetails.firstName &&
      bookingDetails.lastName &&
      bookingDetails.email &&
      bookingDetails.phone &&
      bookingDetails.address &&
      bookingDetails.relationship
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting || !isFormValid()) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      // Only reset if component is still mounted
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Booking Summary
        </h2>
        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium text-gray-900">
              {selectedService.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Practitioner:</span>
            <span className="font-medium text-gray-900">
              {selectedPractitioner.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Schedule:</span>
            <span className="font-medium text-gray-900">
              {getScheduleDescription()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Start Date:</span>
            <span className="font-medium text-gray-900">
              {formatDate(scheduleConfig.startDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">
              {scheduleConfig.timeSlot}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">
              {selectedService.duration}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-600">Price per session:</span>
            <span className="font-medium text-gray-900">
              ₦{selectedService.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-900 font-semibold">Total Amount:</span>
            <span className="font-bold text-blue-600 text-lg">
              ₦{calculateTotalCost().toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Booking For Self Question */}
      {bookingForSelf === null && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Who is this appointment for?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onBookingForSelfChange(true)}
              className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <User className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <div className="font-semibold text-gray-900 mb-1">Myself</div>
              <div className="text-sm text-gray-600">
                Book this appointment for yourself
              </div>
            </button>
            <button
              onClick={() => onBookingForSelfChange(false)}
              className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <div className="font-semibold text-gray-900 mb-1">
                Someone Else
              </div>
              <div className="text-sm text-gray-600">
                Book for a family member or friend
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Service Address Form (for booking for self) */}
      {bookingForSelf === true && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Service Location
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide the address where you'd like to receive the service.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Address *
              </label>
              <textarea
                value={bookingDetails.address}
                onChange={(e) =>
                  updateBookingDetails({ address: e.target.value })
                }
                rows={3}
                placeholder="Enter the full address where the service should be provided..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include street address, city, state, and any specific directions
                if needed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Result
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateBookingDetails({
                    testResult: e.target.files?.[0] || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload an image of test results if available (JPG, PNG, etc.)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Form (if booking for someone else) */}
      {bookingForSelf === false && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Patient Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={bookingDetails.firstName}
                onChange={(e) =>
                  updateBookingDetails({ firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={bookingDetails.lastName}
                onChange={(e) =>
                  updateBookingDetails({ lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={bookingDetails.email}
                onChange={(e) =>
                  updateBookingDetails({ email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={bookingDetails.phone}
                onChange={(e) =>
                  updateBookingDetails({ phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Address *
              </label>
              <textarea
                value={bookingDetails.address}
                onChange={(e) =>
                  updateBookingDetails({ address: e.target.value })
                }
                rows={3}
                placeholder="Enter the full address where the service should be provided..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include street address, city, state, and any specific directions
                if needed.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Result
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateBookingDetails({
                    testResult: e.target.files?.[0] || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload an image of test results if available (JPG, PNG, etc.)
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship to Patient *
              </label>
              <select
                value={bookingDetails.relationship}
                onChange={(e) =>
                  updateBookingDetails({ relationship: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="caregiver">Caregiver</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {bookingForSelf !== null && (
        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading || !isFormValid()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isSubmitting || loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Booking...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Book Appointment(s)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;
