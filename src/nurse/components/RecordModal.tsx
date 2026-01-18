import React, { useState } from "react";
import { X, Camera, Send, Star } from "lucide-react";
import api from "../../constant/api";
import type { BookingData } from "../../types/bookingdata";
import { toast } from "react-toastify";

interface RecordTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingData: BookingData;
}

const RecordTreatmentModal: React.FC<RecordTreatmentModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  bookingId,
}) => {

  const bookingid = bookingId

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
    bookingId: bookingid,
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, sessionRating: rating }));
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setPhotos((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const prepareSubmissionData = (status: "draft" | "completed") => {
    const formDataToSend = new FormData();

    // Add text fields
    if (formData.bloodPressure)
      formDataToSend.append("blood_pressure", formData.bloodPressure);
    if (formData.temperature)
      formDataToSend.append("temperature", formData.temperature);
    if (formData.pulseRate)
      formDataToSend.append("pulse_rate", formData.pulseRate);
    if (formData.bloodSugar)
      formDataToSend.append("blood_sugar", formData.bloodSugar);
    if (formData.oxygenSaturation)
      formDataToSend.append("oxygen_saturation", formData.oxygenSaturation);
    if (formData.currentCondition)
      formDataToSend.append("patient_condition", formData.currentCondition);
    if (formData.treatmentNotes)
      formDataToSend.append("treatment_notes", formData.treatmentNotes);
    if (formData.medicationsAdministered)
      formDataToSend.append(
        "medications_administered",
        formData.medicationsAdministered
      );
    if (formData.nextStepsRecommendations)
      formDataToSend.append("next_steps", formData.nextStepsRecommendations);
    if (formData.sessionRating)
      formDataToSend.append("rating", formData.sessionRating.toString());

    if (formData.bookingId)
      formDataToSend.append("booking_id", formData.bookingId.toString());

    // Add status and timestamp
    formDataToSend.append("status", status);
    if (status === "completed") {
      formDataToSend.append("completed", new Date().toISOString());
    }

    // Add photos
    photos.forEach((photo, index) => {
      formDataToSend.append(`photos[${index}]photo`, photo);
    });

    return formDataToSend;
  };

  const handleSubmit = async () => {
    if (!formData.treatmentNotes.trim()) {
      toast.error("Treatment notes are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = prepareSubmissionData("completed");
      await api.post(
        `services/procedure-booking-report/`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Treatment report submitted successfully");
      onClose();
    } catch (error) {
      console.error("Error submitting treatment report:", error);
      toast.error("Failed to submit treatment report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSaveDraft = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     const draftData = prepareSubmissionData("draft");
  //     await api.post(
  //       `services/nurse-procedure-bookings/${bookingId}/session-report/`,
  //       draftData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("Treatment report saved as draft");
  //     onClose();
  //   } catch (error) {
  //     console.error("Error saving draft:", error);
  //     toast.error("Failed to save draft. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
            disabled={isSubmitting}
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
              Record treatment details for{" "}
              {bookingData.patient_detail.first_name} -{" "}
              {bookingData.patient_detail.last_name}
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
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g., 36.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.temperature}
                onChange={(e) =>
                  handleInputChange("temperature", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pulse Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="e.g., 72"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.pulseRate}
                onChange={(e) => handleInputChange("pulseRate", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Additional Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g., 95"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.bloodSugar}
                onChange={(e) =>
                  handleInputChange("bloodSugar", e.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oxygen Saturation (%)
              </label>
              <input
                type="number"
                step="0.1"
                max="100"
                placeholder="e.g., 98"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.oxygenSaturation}
                onChange={(e) =>
                  handleInputChange("oxygenSaturation", e.target.value)
                }
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          {/* Treatment Photos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Photos (Optional)
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                Add Photo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                />
              </label>
              {photos.length > 0 && (
                <div className="text-sm text-gray-600">
                  {photos.length} photo(s) selected
                </div>
              )}
            </div>
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
                  disabled={isSubmitting}
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
            {/* <button
              onClick={handleSaveDraft}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button> */}
            <button
              onClick={handleSubmit}
              className="flex items-center w-full md:w-auto justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !formData.treatmentNotes.trim()}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordTreatmentModal;
