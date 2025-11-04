// TimeSelection.tsx
import React from "react";
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Service, Practitioner, ScheduleConfig } from "./types";

interface TimeSelectionProps {
  selectedPractitioner: Practitioner;
  selectedService: Service;
  scheduleConfig: ScheduleConfig;
  onTimeSlotSelect: (time: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedPractitioner,
  selectedService,
  scheduleConfig,
  onTimeSlotSelect,
  onBack,
  onContinue,
}) => {
  const [timeValidationError, setTimeValidationError] =
    React.useState<string>("");

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

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  };

  const parseTimeRange = (
    timeString: string
  ): { start: number; end: number } | null => {
    try {
      const lowerString = timeString.toLowerCase().trim();
      const match = lowerString.match(/(\d+)(am|pm)\s*-\s*(\d+)(am|pm)/);

      if (!match) return null;

      let startHour = parseInt(match[1]);
      const startPeriod = match[2];
      let endHour = parseInt(match[3]);
      const endPeriod = match[4];

      // Convert to 24-hour format
      if (startPeriod === "pm" && startHour !== 12) startHour += 12;
      if (startPeriod === "am" && startHour === 12) startHour = 0;
      if (endPeriod === "pm" && endHour !== 12) endHour += 12;
      if (endPeriod === "am" && endHour === 12) endHour = 0;

      return {
        start: startHour * 60, // Convert to minutes
        end: endHour * 60,
      };
    } catch (error) {
      return null;
    }
  };

  const validateTimeAgainstAvailability = (selectedTime: string): boolean => {
    if (!selectedTime) {
      return true;
    }

    if (
      !selectedPractitioner.availability ||
      selectedPractitioner.availability.length === 0
    ) {
      return true;
    }

    const selectedTimeMinutes = convertTimeToMinutes(selectedTime);
    let isTimeValid = false;

    for (const availability of selectedPractitioner.availability) {
      if (typeof availability === "string") {
        const timeRange = parseTimeRange(availability);

        if (timeRange) {
          // Check if selected time falls within this availability slot
          if (
            selectedTimeMinutes >= timeRange.start &&
            selectedTimeMinutes <= timeRange.end
          ) {
            isTimeValid = true;
            break;
          }
        }
      }
    }

    if (!isTimeValid) {
      const availableTimes = selectedPractitioner.availability
        .filter((slot): slot is string => typeof slot === "string")
        .join(", ");

      setTimeValidationError(
        `Selected time ${selectedTime} is not available. Practitioner is available during: ${availableTimes}`
      );
      return false;
    }

    setTimeValidationError("");
    return true;
  };

  const handleTimeSlotSelect = (time: string) => {
    const isValid = validateTimeAgainstAvailability(time);
    if (isValid) {
      onTimeSlotSelect(time);
      setTimeValidationError("");
    } else {
      onTimeSlotSelect(time);
    }
  };

  const handleContinue = () => {
    if (scheduleConfig.timeSlot) {
      const isValid = validateTimeAgainstAvailability(scheduleConfig.timeSlot);
      if (isValid) {
        onContinue();
      }
    }
  };

  // Generate time slots (8:00 AM to 8:00 PM in 1-hour intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const time12h =
        hour > 12
          ? `${hour - 12}:00 PM`
          : hour === 12
          ? `${hour}:00 PM`
          : `${hour}:00 AM`;
      const time24h = `${hour.toString().padStart(2, "0")}:00`;
      slots.push({ display: time12h, value: time24h });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Selected Practitioner Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <img
            src={
              selectedPractitioner.profile_picture ||
              "https://via.placeholder.com/48"
            }
            alt={selectedPractitioner.full_name}
            className="w-12 h-12 rounded-full object-cover self-center sm:self-start flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedPractitioner.full_name}
            </h3>
            <p className="text-blue-600">
              {selectedPractitioner.specialization}
            </p>
            <p className="text-sm text-gray-600">
              {selectedService.name} - {selectedService.duration}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {getScheduleDescription()}
            </p>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="font-semibold text-blue-600">
              ₦{selectedService.price.toLocaleString()}/session
            </p>
            <p className="text-lg font-bold text-blue-600">
              Total: ₦{calculateTotalCost().toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Select Preferred Time
          </h3>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Show Practitioner Availability Info */}
          {selectedPractitioner?.availability?.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Practitioner's Available Days/Times
              </h4>
              <div className="grid gap-2">
                {selectedPractitioner.availability.map(
                  (availability: any, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-md shadow-sm"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {availability}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Time Validation Error */}
          {timeValidationError && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">
                    Invalid Time Selection
                  </p>
                  <p className="text-sm text-red-800">{timeValidationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Time Slot Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Choose Your Time Slot
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => handleTimeSlotSelect(slot.value)}
                  className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                    scheduleConfig.timeSlot === slot.value
                      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm"
                  }`}
                >
                  {slot.display}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time Input */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Or Enter Custom Time
            </h4>
            <div className="space-y-2">
              <input
                type="time"
                value={scheduleConfig.timeSlot}
                onChange={(e) => handleTimeSlotSelect(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-sm text-gray-500">
                💡 Please ensure the time aligns with the practitioner's
                availability above
              </p>
            </div>
          </div>

          {/* Selected Time Confirmation */}
          {scheduleConfig.timeSlot && !timeValidationError && (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-1">
                    Time Selected: {scheduleConfig.timeSlot}
                  </p>
                  <p className="text-sm text-blue-700 mb-2">
                    {getScheduleDescription()}
                  </p>
                  <p className="text-sm font-semibold text-blue-900">
                    Total Cost: ₦{calculateTotalCost().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Schedule</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={!scheduleConfig.timeSlot || !!timeValidationError}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
