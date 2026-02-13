import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FileText,
  GraduationCap,
  Phone,
  User,
  CheckCircle,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  FileCheck,
} from "lucide-react";
import api from "../../constant/api";
import { useNavigate } from "react-router-dom";

interface FileUpload {
  file: File | null;
  preview: string | null;
}

export default function CHWVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate()

  // Form data state
  const [formData, setFormData] = useState({
    institution: "",
    year_of_graduation: new Date().getFullYear(),
    year_of_experience: "",
    biography: "",
    emergency_contact_details: "",
  });

  // File uploads state
  const [files, setFiles] = useState<{
    utility_bill: FileUpload;
    certificate_document: FileUpload;
    id_card: FileUpload;
    photo: FileUpload;
  }>({
    utility_bill: { file: null, preview: null },
    certificate_document: { file: null, preview: null },
    id_card: { file: null, preview: null },
    photo: { file: null, preview: null },
  });

  const verificationMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/user/chw/verification/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      navigate("/chw")
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit verification. Please try again.",
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof files,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }

      // Create preview for images
      let preview: string | null = null;
      if (
        (fieldName === "photo" || fieldName === "id_card") &&
        file.type.startsWith("image/")
      ) {
        preview = URL.createObjectURL(file);
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: { file, preview },
      }));
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.institution ||
      !formData.year_of_experience ||
      !formData.biography ||
      !formData.emergency_contact_details
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate required files
    if (
      !files.utility_bill.file ||
      !files.certificate_document.file ||
      !files.id_card.file ||
      !files.photo.file
    ) {
      alert("Please upload all required documents");
      return;
    }

    // Create FormData
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append("institution", formData.institution);
    formDataToSend.append(
      "year_of_graduation",
      formData.year_of_graduation.toString(),
    );
    formDataToSend.append("year_of_experience", formData.year_of_experience);
    formDataToSend.append("biography", formData.biography);
    formDataToSend.append(
      "emergency_contact_details",
      formData.emergency_contact_details,
    );

    // Append files
    if (files.utility_bill.file)
      formDataToSend.append("utility_bill", files.utility_bill.file);
    if (files.certificate_document.file)
      formDataToSend.append(
        "certificate_document",
        files.certificate_document.file,
      );
    if (files.id_card.file)
      formDataToSend.append("id_card", files.id_card.file);
    if (files.photo.file) formDataToSend.append("photo", files.photo.file);

    verificationMutation.mutate(formDataToSend);
  };

  const FileUploadBox = ({
    label,
    fieldName,
    accept,
    required = false,
    icon: Icon,
  }: {
    label: string;
    fieldName: keyof typeof files;
    accept: string;
    required?: boolean;
    icon: any;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          files[fieldName].file
            ? "border-green-400 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-green-400"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(e, fieldName)}
          className="hidden"
          id={fieldName}
        />
        <label
          htmlFor={fieldName}
          className="flex flex-col items-center cursor-pointer"
        >
          {files[fieldName].preview ? (
            <img
              src={files[fieldName].preview!}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
          ) : (
            <Icon
              className={`w-12 h-12 mb-2 ${
                files[fieldName].file ? "text-green-500" : "text-gray-400"
              }`}
            />
          )}
          <span
            className={`text-sm ${
              files[fieldName].file ? "text-green-600" : "text-gray-600"
            }`}
          >
            {files[fieldName].file
              ? files[fieldName].file!.name
              : "Click to upload"}
          </span>
          {!files[fieldName].file && (
            <span className="text-xs text-gray-500 mt-1">Max size: 10MB</span>
          )}
        </label>
      </div>
    </div>
  );

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verification Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your verification request has been successfully submitted. Our team
            will review your documents and get back to you within 2-3 business
            days.
          </p>
          <button
            onClick={() => (window.location.href = "/chw")}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CHW Verification
          </h1>
          <p className="text-gray-600">
            Complete your profile to become a verified Community Health Worker
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.number
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.number
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                      Institution <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Name of training institution"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Graduation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year_of_graduation"
                    value={formData.year_of_graduation}
                    onChange={handleInputChange}
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year_of_experience"
                  value={formData.year_of_experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about yourself, your passion for community health, and your experience..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Emergency Contact Details{" "}
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  name="emergency_contact_details"
                  value={formData.emergency_contact_details}
                  onChange={handleInputChange}
                  placeholder="Name: John Doe, Phone: +234 XXX XXX XXXX, Relationship: Spouse"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upload Documents
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Document Requirements
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      All documents must be clear, legible, and in PDF, JPG, or
                      PNG format (max 10MB each)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadBox
                  label="Utility Bill"
                  fieldName="utility_bill"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  icon={FileCheck}
                />

                <FileUploadBox
                  label="Certificate"
                  fieldName="certificate_document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  icon={GraduationCap}
                />

                <FileUploadBox
                  label="ID Card"
                  fieldName="id_card"
                  accept=".jpg,.jpeg,.png,.pdf"
                  required
                  icon={User}
                />

                <FileUploadBox
                  label="Profile Photo"
                  fieldName="photo"
                  accept=".jpg,.jpeg,.png"
                  required
                  icon={ImageIcon}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 2 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={verificationMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {verificationMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Verification
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
