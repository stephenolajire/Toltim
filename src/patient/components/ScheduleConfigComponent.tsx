// ScheduleConfig.tsx
import React from "react";
import {
  ArrowLeft,
  CalendarDays,
  Calendar,
  Repeat,
} from "lucide-react";
import type { Service, Practitioner, ScheduleConfig } from "./types";

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
  const getDaysOfWeek = () => [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

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

  const updateScheduleConfig = (updates: Partial<ScheduleConfig>) => {
    onScheduleConfigChange({ ...scheduleConfig, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Selected Practitioner Summary */}
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
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="font-semibold text-green-600">
              ₦{selectedService.price.toLocaleString()}/session
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
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <CalendarDays className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Daily</h4>
                <p className="text-sm text-gray-600">Every day</p>
              </button>

              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "specific-days",
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "specific-days"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <Calendar className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Specific Days</h4>
                <p className="text-sm text-gray-600">Select days of week</p>
              </button>

              <button
                onClick={() =>
                  updateScheduleConfig({
                    frequency: "every-other-day",
                    selectedDays: [],
                  })
                }
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  scheduleConfig.frequency === "every-other-day"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <Repeat className="w-6 h-6 text-green-600 mb-2" />
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
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <Calendar className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Weekly</h4>
                <p className="text-sm text-gray-600">Once per week</p>
              </button>
            </div>
          </div>

          {/* Days of Week Selection */}
          {scheduleConfig.frequency === "specific-days" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Days of the Week
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {getDaysOfWeek().map((day) => (
                  <button
                    key={day.value}
                    onClick={() => {
                      const isSelected = scheduleConfig.selectedDays.includes(
                        day.value
                      );
                      const newSelectedDays = isSelected
                        ? scheduleConfig.selectedDays.filter(
                            (d) => d !== day.value
                          )
                        : [...scheduleConfig.selectedDays, day.value];
                      updateScheduleConfig({
                        selectedDays: newSelectedDays,
                      });
                    }}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      scheduleConfig.selectedDays.includes(day.value)
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            disabled={
              !scheduleConfig.frequency ||
              !scheduleConfig.startDate ||
              (scheduleConfig.frequency === "specific-days" &&
                scheduleConfig.selectedDays.length === 0)
            }
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Continue to Time Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleConfigComponent;
