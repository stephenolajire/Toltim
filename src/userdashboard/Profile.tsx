import React, { useState } from "react";
import { Calendar, ChevronDown} from "lucide-react";

interface FormData {
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  genotype: string;
  homeAddress: string;
  emergencyContact: string;
  medicalHistory: string;
}

const MedicalProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    genotype: "",
    homeAddress: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    bloodGroup: false,
    genotype: false,
  });

  const genderOptions = ["Male", "Female", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genotypeOptions = ["AA", "AS", "SS", "AC", "SC"];

  const handleInputChange = (field: keyof FormData, value: string) => {
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
    field: keyof FormData,
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
    console.log("Form submitted:", formData);
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
    field: keyof FormData;
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
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            Help us provide better healthcare by sharing your medical
            information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Medical Information
            </h3>
            <p className="text-gray-600 text-sm">
              This information helps us match you with the right healthcare
              professionals
            </p>
          </div>

          <div className="space-y-6">
            {/* Date of Birth and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <CustomDropdown
                label="Gender"
                value={formData.gender}
                placeholder="Select gender"
                options={genderOptions}
                field="gender"
                dropdownKey="gender"
              />
            </div>

            {/* Blood Group and Genotype Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomDropdown
                label="Blood Group"
                value={formData.bloodGroup}
                placeholder="Select blood group"
                options={bloodGroupOptions}
                field="bloodGroup"
                dropdownKey="bloodGroup"
              />

              <CustomDropdown
                label="Genotype"
                value={formData.genotype}
                placeholder="Select genotype"
                options={genotypeOptions}
                field="genotype"
                dropdownKey="genotype"
              />
            </div>

            {/* Home Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Address
              </label>
              <input
                type="text"
                placeholder="Enter your full address"
                value={formData.homeAddress}
                onChange={(e) =>
                  handleInputChange("homeAddress", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                placeholder="Emergency contact phone number"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Medical History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical History (Optional)
              </label>
              <textarea
                placeholder="Any chronic conditions, allergies, or ongoing medications..."
                value={formData.medicalHistory}
                onChange={(e) =>
                  handleInputChange("medicalHistory", e.target.value)
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
              Complete Profile Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileForm;
