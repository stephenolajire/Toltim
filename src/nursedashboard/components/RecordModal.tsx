import React, { useState } from "react";
import { X, Camera, Send, Star } from "lucide-react";

interface RecordTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  treatmentType?: string;
}

const RecordTreatmentModal: React.FC<RecordTreatmentModalProps> = ({
  isOpen,
  onClose,
  patientName = "Sarah Johnson",
  treatmentType = "Daily wound dressing for 7 days",
}) => {
  const [formData, setFormData] = useState({
    bloodPressure: "",
    temperature: "",
    pulseRate: "",
    bloodSugar: "",
    oxygenSaturation: "",
    currentCondition: "",
    treatmentNotes: "",
    medicationsAdministered: "",
    nextStepsRecommendations: "",
    sessionRating: 0,
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, sessionRating: rating }));
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleSubmit = () => {
    console.log("Submitting treatment report:", formData);
    // Handle form submission
    onClose();
  };

  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData);
    // Handle save as draft
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Record Treatment Session
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Treatment Session Report Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Treatment Session Report
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Record treatment details for {patientName} - {treatmentType}
            </p>
          </div>

          {/* Vital Signs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure
              </label>
              <input
                type="text"
                placeholder="e.g., 120/80 mmHg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.bloodPressure}
                onChange={(e) =>
                  handleInputChange("bloodPressure", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature
              </label>
              <input
                type="text"
                placeholder="e.g., 36.5°C"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.temperature}
                onChange={(e) =>
                  handleInputChange("temperature", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pulse Rate
              </label>
              <input
                type="text"
                placeholder="e.g., 72 bpm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.pulseRate}
                onChange={(e) => handleInputChange("pulseRate", e.target.value)}
              />
            </div>
          </div>

          {/* Additional Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Sugar
              </label>
              <input
                type="text"
                placeholder="e.g., 95 mg/dL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.bloodSugar}
                onChange={(e) =>
                  handleInputChange("bloodSugar", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oxygen Saturation
              </label>
              <input
                type="text"
                placeholder="e.g., 98%"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.oxygenSaturation}
                onChange={(e) =>
                  handleInputChange("oxygenSaturation", e.target.value)
                }
              />
            </div>
          </div>

          {/* Current Patient Condition */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Patient Condition
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={formData.currentCondition}
              onChange={(e) =>
                handleInputChange("currentCondition", e.target.value)
              }
            >
              <option value="">Select condition status</option>
              <option value="improving">Improving</option>
              <option value="stable">Stable</option>
              <option value="declining">Declining</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Treatment Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe the care provided, patient response, observations, and any concerns..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              value={formData.treatmentNotes}
              onChange={(e) =>
                handleInputChange("treatmentNotes", e.target.value)
              }
            />
          </div>

          {/* Medications Administered */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medications Administered
            </label>
            <textarea
              rows={3}
              placeholder="List medications given, dosages, and times..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              value={formData.medicationsAdministered}
              onChange={(e) =>
                handleInputChange("medicationsAdministered", e.target.value)
              }
            />
          </div>

          {/* Next Steps & Recommendations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Steps & Recommendations
            </label>
            <textarea
              rows={3}
              placeholder="Recommendations for continued care, follow-up instructions, or concerns to monitor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              value={formData.nextStepsRecommendations}
              onChange={(e) =>
                handleInputChange("nextStepsRecommendations", e.target.value)
              }
            />
          </div>

          {/* Treatment Photos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Photos (Optional)
            </label>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4" />
              Add Photo
            </button>
          </div>

          {/* Rate This Session */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate This Session
            </label>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredStar || formData.sessionRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              How would you rate the overall session?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordTreatmentModal;
