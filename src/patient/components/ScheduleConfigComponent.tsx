// ScheduleConfig.tsx
import React from "react";
import { ArrowLeft, CalendarDays, Calendar, Repeat } from "lucide-react";
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

interface ScheduleConfigProps {
  selectedPractitioner: Practitioner;
  selectedService: Service;
  scheduleConfig: ScheduleConfig;
  onScheduleConfigChange: (config: ScheduleConfig) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ScheduleConfigComponent: React.FC<ScheduleConfigProps> = ({
  selectedPractitioner,
  selectedService,
  scheduleConfig,
  onScheduleConfigChange,
  onBack,
  onContinue,
}) => {
  /* Commented out: specific-days are no longer needed
  const getDaysOfWeek = () => [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];
  */

  const calculateTotalCost = () => {
    let multiplier = 1;

    if (scheduleConfig.frequency === "daily") {
      multiplier = scheduleConfig.totalDays;
      /* Commented out: specific-days calculation removed
    } else if (scheduleConfig.frequency === "specific-days") {
      const weeksInPeriod = Math.ceil(scheduleConfig.totalDays / 7);
      multiplier = weeksInPeriod * scheduleConfig.selectedDays.length;
    */
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

  const updateScheduleConfig = (updates: Partial<ScheduleConfig>) => {
    onScheduleConfigChange({ ...scheduleConfig, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Selected Practitioner Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <img
            src={
              selectedPractitioner.profile_picture ||
              selectedPractitioner.profileImage ||
              "https://via.placeholder.com/64"
            }
            alt={selectedPractitioner.full_name || selectedPractitioner.name}
            className="w-12 h-12 rounded-full object-cover self-center sm:self-start flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedPractitioner.full_name || selectedPractitioner.name}
            </h3>
            <p className="text-blue-600">
              {formatSpecialization(selectedPractitioner.specialization) ||
                selectedPractitioner.title}
            </p>
            <p className="text-sm text-gray-600">
              {selectedService.name} - {selectedService.duration || "As needed"}
            </p>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="font-semibold text-blue-600">
              ₦{selectedService.price?.toLocaleString() || "N/A"}/session
            </p>
            <p className="text-sm text-gray-600">
              Total: {scheduleConfig.totalDays} days
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <CalendarDays className="w-5 h-5" />
          <span>Configure Schedule</span>
        </h3>

        {/* Frequency Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Appointment Frequency
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "daily",
                    selectedDays: [],
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "daily"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <CalendarDays className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Daily</h4>
                <p className="text-sm text-gray-600">Every day</p>
              </button>

              {/* Specific Days option removed - feature deprecated
              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "specific-days",
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "specific-days"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Specific Days</h4>
                <p className="text-sm text-gray-600">Select days of week</p>
              </button>
              */}

              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "every-other-day",
                    selectedDays: [],
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "every-other-day"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <Repeat className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Every Other Day</h4>
                <p className="text-sm text-gray-600">Skip one day between</p>
              </button>

              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "weekly",
                    selectedDays: [],
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "weekly"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Weekly</h4>
                <p className="text-sm text-gray-600">Once per week</p>
              </button>
            </div>
          </div>

          {/* Days of Week Selection */}
          {/* Specific-days selection removed; not needed anymore */}

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={scheduleConfig.startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                updateScheduleConfig({
                  startDate: e.target.value,
                })
              }
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Schedule Summary */}
        {scheduleConfig.frequency && scheduleConfig.startDate && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Schedule Summary
            </h4>
            <p className="text-blue-800 text-sm">{getScheduleDescription()}</p>
            <p className="text-blue-800 text-sm mt-1">
              Estimated total cost: ₦{calculateTotalCost().toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Practitioners</span>
          </button>

          <button
            onClick={onContinue}
            disabled={!scheduleConfig.frequency || !scheduleConfig.startDate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Continue to Time Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfigComponent;
