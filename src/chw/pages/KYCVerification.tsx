// Main KYC Component - NurseKycVerification.tsx
import React, { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import api from "../../constant/api";
import {
  type PersonalInfo,
  type EmploymentInfo,
  type RequiredDocuments,
  type KycStage,
} from "../../types/kyctypes"
import { KycIntroduction } from "./components/KYCIntroduction";
import { ProgressTracker } from "./components/ProgressTracker";
import { ProfessionalInfoForm } from "./components/ProfessionalInfoForm";
import { EmploymentInfoForm } from "./components/EmploymentInfoForm";
import { DocumentUpload } from "./components/DocumentUpload";
import { ReviewStatus } from "./components/ReviewStatus";

import { useNavigate } from "react-router-dom";

const NurseKycVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    licenseNumber: "",
    yearsExperience: "",
    specialization: "",
    nursingSchool: "",
    graduationYear: "",
  });

  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo>({
    workplace: "",
    workAddress: "",
    biography: "",
    emergencyContact: "",
  });

  const [documents, setDocuments] = useState<RequiredDocuments>({
    nursingLicense: null,
    resume: null,
    governmentId: null,
    certificates: null,
    employmentLetter: null,
    photo: null,
  });

  const stages: KycStage[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Upload required documents and complete application form",
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 1 || currentStep === 2 || currentStep === 3
          ? "current"
          : "pending",
      icon: <Upload className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Employment Information",
      description: "Our team reviews your credentials and documents",
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
          ? "review"
          : "pending",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Documentation Upload",
      description: "Verification of license and employment history",
      status: "pending",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Review",
      description: "Account activation and welcome to platform",
      status: "pending",
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    setCurrentStep(2);
  };

  const handleEmploymentInfoSubmit = (data: EmploymentInfo) => {
    setEmploymentInfo(data);
    setCurrentStep(3);
  };

  // Updated handleDocumentSubmit function for your NurseKycVerification component
  const navigate = useNavigate()

  const handleDocumentSubmit = async (documentData: RequiredDocuments) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add personal info - using exact field names from cURL
      formData.append("license_number", personalInfo.licenseNumber || "");
      formData.append("year_of_experience", personalInfo.yearsExperience || "");
      formData.append("specialization", personalInfo.specialization || "");
      formData.append("institution", personalInfo.nursingSchool || "");
      formData.append("year_of_graduation", personalInfo.graduationYear || "0");

      // Add employment info - using exact field names from cURL
      formData.append("workplace", employmentInfo.workplace || "");
      formData.append("work_address", employmentInfo.workAddress || "");
      formData.append("biography", employmentInfo.biography || "");
      formData.append(
        "emergency_contact_details",
        employmentInfo.emergencyContact || ""
      );

      // Add documents - using exact field names from cURL
      if (documentData.nursingLicense) {
        formData.append("license_document", documentData.nursingLicense);
      }
      if (documentData.resume) {
        formData.append("cv_document", documentData.resume);
      }
      if (documentData.governmentId) {
        formData.append("id_card", documentData.governmentId);
      }
      if (documentData.certificates) {
        formData.append("certificate_document", documentData.certificates);
      }
      if (documentData.employmentLetter) {
        formData.append("employment_letter", documentData.employmentLetter);
      }
      if (documentData.photo) {
        formData.append("photo", documentData.photo);
      }

      // Submit to API as FormData
      const response = await api.post("/user/nurse/verification/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if submission was successful
      if (response.data.success !== false) {
        setDocuments(documentData);
        setCurrentStep(4);
        localStorage.removeItem("kyc")
        localStorage.setItem("kyc", "submitted")

        setTimeout(()=> {
          navigate('/nurse')
        }, 3000)
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error: any) {
      console.error("KYC submission error:", error);

      // Enhanced error handling
      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRestart = () => {
    setCurrentStep(0);
    setSubmitError(null);
    setPersonalInfo({
      licenseNumber: "",
      yearsExperience: "",
      specialization: "",
      nursingSchool: "",
      graduationYear: "",
    });
    setEmploymentInfo({
      workplace: "",
      workAddress: "",
      biography: "",
      emergencyContact: "",
    });
    setDocuments({
      nursingLicense: null,
      resume: null,
      governmentId: null,
      certificates: null,
      employmentLetter: null,
      photo: null,
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <KycIntroduction onStart={() => setCurrentStep(1)} />;

      case 1:
        return (
          <ProfessionalInfoForm
            initialData={personalInfo}
            onNext={handlePersonalInfoSubmit}
            onBack={() => setCurrentStep(0)}
          />
        );

      case 2:
        return (
          <EmploymentInfoForm
            initialData={employmentInfo}
            onNext={handleEmploymentInfoSubmit}
            onBack={() => setCurrentStep(1)}
          />
        );

      case 3:
        return (
          <div>
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}
            <DocumentUpload
              initialData={documents}
              onNext={handleDocumentSubmit}
              onBack={() => setCurrentStep(2)}
            />
          </div>
        );

      case 4:
        return <ReviewStatus onRestart={handleRestart} />;

      default:
        return <KycIntroduction onStart={() => setCurrentStep(1)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {currentStep > 0 && currentStep < 4 && (
          <ProgressTracker stages={stages} currentStage={currentStep - 1} />
        )}

        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Submitting your application...</p>
            </div>
          </div>
        )}

        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default NurseKycVerification;
