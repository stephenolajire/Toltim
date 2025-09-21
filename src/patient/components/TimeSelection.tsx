// TimeSelection.tsx
import React from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Selected Practitioner Summary with Schedule Config */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <img
            src={selectedPractitioner.profileImage}
            alt={selectedPractitioner.name}
            className="w-12 h-12 rounded-full object-cover self-center sm:self-start flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedPractitioner.name}
            </h3>
            <p className="text-green-600">{selectedPractitioner.title}</p>
            <p className="text-sm text-gray-600">
              {selectedService.name} - {selectedService.duration}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {getScheduleDescription()}
            </p>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="font-semibold text-green-600">
              ₦{selectedService.price.toLocaleString()}/session
            </p>
            <p className="text-lg font-bold text-green-600">
              Total: ₦{calculateTotalCost().toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Preferred Time
        </h3>

        <div className="space-y-4">
          {/* Available Time Slots from Practitioner */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Available Time Slots
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {selectedPractitioner?.availability?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {selectedPractitioner.availability[0].slots.map(
                    (slot: string) => (
                      <button
                        key={slot}
                        onClick={() => onTimeSlotSelect(slot)}
                        className={`p-2 sm:p-3 text-sm rounded-lg border transition-colors ${
                          scheduleConfig.timeSlot === slot
                            ? "bg-green-600 text-white border-green-600"
                            : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No available slots for this practitioner.
                </p>
              )}
            </div>
          </div>

          {/* Custom Time Input */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Or Enter Custom Time
            </h4>
            <div className="flex items-center space-x-4">
              <input
                type="time"
                value={scheduleConfig.timeSlot}
                onChange={(e) => onTimeSlotSelect(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600">
                Subject to practitioner availability
              </p>
            </div>
          </div>
        </div>

        {scheduleConfig.timeSlot && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-sm sm:text-base break-words">
                  Selected Time: {scheduleConfig.timeSlot}
                </span>
                <p className="text-sm mt-1">{getScheduleDescription()}</p>
                <p className="text-sm font-medium mt-1">
                  Total Cost: ₦{calculateTotalCost().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Schedule Config</span>
          </button>

          <button
            onClick={onContinue}
            disabled={!scheduleConfig.timeSlot}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
