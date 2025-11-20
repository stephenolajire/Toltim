// TimeSelection.tsx
import React from "react";
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Service, Practitioner, ScheduleConfig } from "./types";

const formatSpecialization = (specialization: any): string => {
  if (!specialization) return "General Practice";

  if (Array.isArray(specialization)) {
    return (
      specialization
        .map((spec) => {
          if (typeof spec === "object" && spec !== null && spec.name) {
            return spec.name;
          }
          if (typeof spec === "string") {
            return spec;
          }
          return null;
        })
        .filter(Boolean)
        .join(", ") || "General Practice"
    );
  }

  if (
    typeof specialization === "object" &&
    specialization !== null &&
    specialization.name
  ) {
    return specialization.name;
  }

  if (typeof specialization === "string") {
    return specialization;
  }

  return "General Practice";
};

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
  const [timeValidationError, setTimeValidationError] = React.useState("");

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
    // Handle both 24-hour format (HH:mm) and 12-hour format (h:mm AM/PM)
    const lowerTime = time.toLowerCase().trim();

    // Check for AM/PM format
    if (lowerTime.includes("am") || lowerTime.includes("pm")) {
      const isPM = lowerTime.includes("pm");
      const timeDigits = lowerTime.replace(/[ap]m/gi, "").trim();
      const [hours, minutes = 0] = timeDigits.split(":").map(Number);

      let hour24 = hours;
      if (isPM && hours !== 12) {
        hour24 = hours + 12;
      } else if (!isPM && hours === 12) {
        hour24 = 0;
      }

      return hour24 * 60 + minutes;
    }

    // Handle 24-hour format
    const [hours, minutes = 0] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const parseTimeRange = (
    timeString: string
  ): { start: number; end: number } | null => {
    try {
      const lowerString = timeString.toLowerCase().trim();

      // Match various formats:
      // "Monday 10:00 AM-7:00 PM"
      // "Monday - Sunday: 8am - 5pm"
      // "8am - 5pm"
      // "10:00 AM-7:00 PM"

      // Remove day names and colons after day names
      const timeOnly = lowerString
        .replace(
          /monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi,
          ""
        )
        .replace(/^[\s:-]+/, "")
        .trim();

      // Match time range: "10:00 AM-7:00 PM" or "8am - 5pm"
      const match = timeOnly.match(
        /(\d+):?(\d*)?\s*(am|pm)\s*-\s*(\d+):?(\d*)?\s*(am|pm)/
      );

      if (!match) return null;

      let startHour = parseInt(match[1]);
      const startMinute = parseInt(match[2] || "0");
      const startPeriod = match[3];
      let endHour = parseInt(match[4]);
      const endMinute = parseInt(match[5] || "0");
      const endPeriod = match[6];

      // Convert to 24-hour format
      if (startPeriod === "pm" && startHour !== 12) startHour += 12;
      if (startPeriod === "am" && startHour === 12) startHour = 0;
      if (endPeriod === "pm" && endHour !== 12) endHour += 12;
      if (endPeriod === "am" && endHour === 12) endHour = 0;

      return {
        start: startHour * 60 + startMinute,
        end: endHour * 60 + endMinute,
      };
    } catch (error) {
      console.error("Error parsing time range:", error);
      return null;
    }
  };

  const formatAvailabilityDisplay = (): string => {
    if (
      !selectedPractitioner.availability ||
      selectedPractitioner.availability.length === 0
    ) {
      return "Not specified";
    }

    // Get the first availability entry
    const firstAvailability = selectedPractitioner.availability[0];
    if (typeof firstAvailability === "string") {
      // Extract just the time portion and reformat
      const timeRange = parseTimeRange(firstAvailability);
      if (timeRange) {
        const startHour = Math.floor(timeRange.start / 60);
        const startMin = timeRange.start % 60;
        const endHour = Math.floor(timeRange.end / 60);
        const endMin = timeRange.end % 60;

        const formatTime = (hour: number, min: number) => {
          const period = hour >= 12 ? "PM" : "AM";
          const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          return `${hour12}:${min.toString().padStart(2, "0")} ${period}`;
        };

        return `Monday - Sunday: ${formatTime(
          startHour,
          startMin
        )} - ${formatTime(endHour, endMin)}`;
      }

      // If parsing fails, return as is
      return firstAvailability.includes("Monday") ||
        firstAvailability.includes("day")
        ? firstAvailability
        : `Monday - Sunday: ${firstAvailability}`;
    }
    return "Not specified";
  };

  const validateTimeAgainstAvailability = (selectedTime: string): boolean => {
    if (!selectedTime) {
      return true;
    }

    if (
      !selectedPractitioner.availability ||
      selectedPractitioner.availability.length === 0
    ) {
      return true; // No restrictions if no availability specified
    }

    const selectedTimeMinutes = convertTimeToMinutes(selectedTime);
    let isTimeValid = false;

    // Check against all availability slots
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
      const availabilityDisplay = formatAvailabilityDisplay();
      setTimeValidationError(
        `Selected time is not within available hours. Practitioner is available: ${availabilityDisplay}`
      );
      return false;
    }

    setTimeValidationError("");
    return true;
  };

  const handleTimeSlotSelect = (time: string) => {
    onTimeSlotSelect(time);
    // Validate after a short delay to ensure state is updated
    setTimeout(() => {
      validateTimeAgainstAvailability(time);
    }, 100);
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {selectedPractitioner.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">
              {selectedPractitioner.full_name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {formatSpecialization(selectedPractitioner.specialization)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <span className="font-semibold mr-2">Service:</span>
                <span>
                  {selectedService.name} -{" "}
                  {selectedService.duration || "As needed"}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="font-semibold mr-2">Schedule:</span>
                <span>{getScheduleDescription()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-700">
                  <span className="font-semibold">Price per session:</span> ₦
                  {selectedService.price?.toLocaleString() || "N/A"}
                </span>
                <span className="font-bold text-blue-700 text-base">
                  Total: ₦{calculateTotalCost().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="w-7 h-7 mr-3 text-blue-600" />
          Select Preferred Time
        </h2>

        {/* Show Practitioner Availability Info */}
        {selectedPractitioner?.availability?.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Practitioner's Available Hours
                </h4>
                <p className="text-blue-800 font-medium">
                  {formatAvailabilityDisplay()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time Validation Error */}
        {timeValidationError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">
                  Invalid Time Selection
                </h4>
                <p className="text-red-800 text-sm">{timeValidationError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Time Slot Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Choose Your Time Slot
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
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
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Or Enter Custom Time
          </h3>
          <input
            type="time"
            value={scheduleConfig.timeSlot || ""}
            onChange={(e) => handleTimeSlotSelect(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2">
            💡 Please ensure the time aligns with the practitioner's
            availability above
          </p>
        </div>

        {/* Selected Time Confirmation */}
        {scheduleConfig.timeSlot && !timeValidationError && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-2">
                  Time Selected: {scheduleConfig.timeSlot}
                </h4>
                <p className="text-green-800 text-sm mb-1">
                  {getScheduleDescription()}
                </p>
                <p className="text-green-800 font-semibold">
                  Total Cost: ₦{calculateTotalCost().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Schedule
        </button>
        <button
          onClick={handleContinue}
          disabled={!scheduleConfig.timeSlot || !!timeValidationError}
          className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
            scheduleConfig.timeSlot && !timeValidationError
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Booking
          <CheckCircle className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TimeSelection;
