import React, { useState } from "react";
import {ChevronDown } from "lucide-react";

interface AssessmentData {
  currentSymptoms: string;
  symptomSeverity: string;
  symptomDuration: string;
  urgencyLevel: string;
  currentMedications: string;
  knownAllergies: string;
  previousTreatment: string;
}

const HealthAssessmentForm: React.FC = () => {
  const [formData, setFormData] = useState<AssessmentData>({
    currentSymptoms: "",
    symptomSeverity: "",
    symptomDuration: "",
    urgencyLevel: "",
    currentMedications: "",
    knownAllergies: "",
    previousTreatment: "",
  });

  const [dropdownStates, setDropdownStates] = useState({
    severity: false,
    duration: false,
    urgency: false,
  });

  const severityOptions = ["Mild", "Moderate", "Severe", "Very Severe"];
  const durationOptions = [
    "Less than a day",
    "1-3 days",
    "1 week",
    "2-4 weeks",
    "More than a month",
  ];
  const urgencyOptions = [
    "Not urgent",
    "Mild urgency",
    "Moderate urgency",
    "High urgency",
    "Emergency",
  ];

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const selectOption = (
    field: keyof AssessmentData,
    value: string,
    dropdown: keyof typeof dropdownStates
  ) => {
    handleInputChange(field, value);
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: false,
    }));
  };

  const handleSubmit = () => {
    console.log("Assessment submitted:", formData);
    // Handle form submission here
  };

  const CustomDropdown = ({
    label,
    value,
    placeholder,
    options,
    field,
    dropdownKey,
  }: {
    label: string;
    value: string;
    placeholder: string;
    options: string[];
    field: keyof AssessmentData;
    dropdownKey: keyof typeof dropdownStates;
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        className="w-full p-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
        onClick={() => toggleDropdown(dropdownKey)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            dropdownStates[dropdownKey] ? "rotate-180" : ""
          }`}
        />
      </div>
      {dropdownStates[dropdownKey] && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-900"
              onClick={() => selectOption(field, option, dropdownKey)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-green-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Toltimed</h1>
          </div> */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Health Assessment
          </h2>
          <p className="text-gray-600">
            Help us understand your current health needs
          </p>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tell Us About Your Symptoms
            </h3>
            <p className="text-gray-600 text-sm">
              This information helps us recommend appropriate tests and connect
              you with the right nurse
            </p>
          </div>

          <div className="space-y-6">
            {/* Current Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Symptoms
              </label>
              <textarea
                placeholder="Describe your current symptoms in detail..."
                value={formData.currentSymptoms}
                onChange={(e) =>
                  handleInputChange("currentSymptoms", e.target.value)
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
              />
            </div>

            {/* Symptom Severity and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomDropdown
                label="Symptom Severity"
                value={formData.symptomSeverity}
                placeholder="Select severity"
                options={severityOptions}
                field="symptomSeverity"
                dropdownKey="severity"
              />

              <CustomDropdown
                label="Symptom Duration"
                value={formData.symptomDuration}
                placeholder="How long?"
                options={durationOptions}
                field="symptomDuration"
                dropdownKey="duration"
              />
            </div>

            {/* Urgency Level */}
            <div>
              <CustomDropdown
                label="How urgent is your need for care?"
                value={formData.urgencyLevel}
                placeholder="Select urgency level"
                options={urgencyOptions}
                field="urgencyLevel"
                dropdownKey="urgency"
              />
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                placeholder="List any medications you're currently taking"
                value={formData.currentMedications}
                onChange={(e) =>
                  handleInputChange("currentMedications", e.target.value)
                }
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
              />
            </div>

            {/* Known Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies
              </label>
              <textarea
                placeholder="Any drug or food allergies"
                value={formData.knownAllergies}
                onChange={(e) =>
                  handleInputChange("knownAllergies", e.target.value)
                }
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
              />
            </div>

            {/* Previous Treatment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Treatment for Similar Condition
              </label>
              <textarea
                placeholder="Have you been treated for this condition before?"
                value={formData.previousTreatment}
                onChange={(e) =>
                  handleInputChange("previousTreatment", e.target.value)
                }
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white p-2 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Complete Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessmentForm;
