import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  User,
  FileText,
  Shield,
  Award,
} from "lucide-react";

// Types
interface PersonalInfo {
  licenseNumber: string;
  yearsExperience: string;
  specialization: string;
  nursingSchool: string;
  graduationYear: string;
}

interface EmploymentInfo {
  workplace: string;
  workAddress: string;
  biography: string;
  emergencyContact: string;
}

interface RequiredDocuments {
  nursingLicense: File | null;
  resume: File | null;
  governmentId: File | null;
  certificates: File | null;
  employmentLetter: File | null;
  photo: File | null;
}

interface KycStage {
  id: number;
  title: string;
  description: string;
  status: "pending" | "current" | "completed" | "review";
  icon: React.ReactNode;
}

// Introduction Component
const KycIntroduction: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nurse Verification Process
        </h1>
        <p className="text-gray-600">
          Join our platform as a verified healthcare professional
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Valid Nursing License Required
            </h3>
            <p className="text-sm text-gray-600">
              RN/LPN/BSN license in good standing
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Professional Experience
            </h3>
            <p className="text-sm text-gray-600">
              Minimum 1 year of clinical experience
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">
              Background Verification
            </h3>
            <p className="text-sm text-gray-600">
              Clean background check and current employment
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Start Verification Process
      </button>
    </div>
  );
};

// Progress Tracker Component
const ProgressTracker: React.FC<{
  stages: KycStage[];
  currentStage: number;
}> = ({ stages, currentStage }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-semibold text-green-600 mb-4">
        Verification Stages
      </h2>
      <p className="text-gray-600 mb-6">
        Track your application progress through our verification process
      </p>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStage;
          const isCurrent = index === currentStage;

          return (
            <div key={stage.id} className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isCurrent
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : stage.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.title}
                  </h3>
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Professional Information Component
const ProfessionalInfoForm: React.FC<{
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isValid =
    data.licenseNumber &&
    data.yearsExperience &&
    data.specialization &&
    data.nursingSchool &&
    data.graduationYear;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Application Form
      </h2>
      <p className="text-gray-600 mb-6">
        Complete your professional verification details
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-green-600 mb-4">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nursing License Number *
              </label>
              <input
                type="text"
                value={data.licenseNumber}
                onChange={(e) =>
                  onChange({ ...data, licenseNumber: e.target.value })
                }
                placeholder="RN-12345"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <select
                  value={data.yearsExperience}
                  onChange={(e) =>
                    onChange({ ...data, yearsExperience: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select years</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  value={data.specialization}
                  onChange={(e) =>
                    onChange({ ...data, specialization: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select specialty</option>
                  <option value="critical-care">Critical Care</option>
                  <option value="emergency">Emergency</option>
                  <option value="pediatric">Pediatric</option>
                  <option value="surgical">Surgical</option>
                  <option value="general">General Nursing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nursing School/Institution *
              </label>
              <input
                type="text"
                value={data.nursingSchool}
                onChange={(e) =>
                  onChange({ ...data, nursingSchool: e.target.value })
                }
                placeholder="University of Lagos, College of Medicine"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year *
              </label>
              <input
                type="number"
                value={data.graduationYear}
                onChange={(e) =>
                  onChange({ ...data, graduationYear: e.target.value })
                }
                placeholder="2020"
                min="1980"
                max="2025"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next: Employment Details
          </button>
        </div>
      </div>
    </div>
  );
};

const EmploymentInfoForm: React.FC<{
  data: EmploymentInfo;
  onChange: (data: EmploymentInfo) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onChange, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isValid =
    data.workplace &&
    data.workAddress &&
    data.biography &&
    data.emergencyContact;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Employment Information
      </h2>
      <p className="text-gray-600 mb-6">
        Provide details about your current or recent employment
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-green-600 mb-4">
            Current/Recent Employment
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current/Last Workplace *
              </label>
              <input
                type="text"
                value={data.workplace}
                onChange={(e) =>
                  onChange({ ...data, workplace: e.target.value })
                }
                placeholder="Lagos University Teaching Hospital"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Address *
              </label>
              <textarea
                value={data.workAddress}
                onChange={(e) =>
                  onChange({ ...data, workAddress: e.target.value })
                }
                placeholder="Complete address of workplace"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-green-600 mb-4">
            Additional Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Biography *
              </label>
              <textarea
                value={data.biography}
                onChange={(e) =>
                  onChange({ ...data, biography: e.target.value })
                }
                placeholder="Describe your experience, approach to patient care, and what makes you an excellent nurse..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact *
              </label>
              <input
                type="text"
                value={data.emergencyContact}
                onChange={(e) =>
                  onChange({ ...data, emergencyContact: e.target.value })
                }
                placeholder="Name and phone number of emergency contact"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next: Upload Documents
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentUpload: React.FC<{
  documents: RequiredDocuments;
  onChange: (documents: RequiredDocuments) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ documents, onChange, onNext, onBack }) => {
  const handleFileChange = (
    key: keyof RequiredDocuments,
    file: File | null
  ) => {
    onChange({ ...documents, [key]: file });
  };

  const documentTypes = [
    {
      key: "nursingLicense" as keyof RequiredDocuments,
      title: "Nursing License",
      desc: "Valid nursing license certificate",
      icon: Award,
    },
    {
      key: "resume" as keyof RequiredDocuments,
      title: "CV/Resume",
      desc: "Updated professional resume",
      icon: FileText,
    },
    {
      key: "governmentId" as keyof RequiredDocuments,
      title: "Government ID",
      desc: "National ID, Driver's License, or International Passport",
      icon: User,
    },
    {
      key: "certificates" as keyof RequiredDocuments,
      title: "Professional Certificates",
      desc: "CPR, specialized training certificates",
      icon: Award,
    },
    {
      key: "employmentLetter" as keyof RequiredDocuments,
      title: "Employment Letter",
      desc: "Current or recent employment verification",
      icon: FileText,
    },
    {
      key: "photo" as keyof RequiredDocuments,
      title: "Professional Photo",
      desc: "Recent professional headshot",
      icon: User,
    },
  ];

  const allUploaded = documentTypes.every((doc) => documents[doc.key]);

  const handleSubmit = () => {
    if (allUploaded) {
      onNext();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Required Documents
      </h2>
      <p className="text-gray-600 mb-6">
        Upload clear, legible copies of the following documents:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((docType) => {
          const IconComponent = docType.icon;
          const hasFile = documents[docType.key];

          return (
            <div
              key={docType.key}
              className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-green-300 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    hasFile ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {hasFile ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <h3 className="font-medium text-gray-900 mb-1">
                  {docType.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{docType.desc}</p>

                <label
                  className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hasFile
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {hasFile ? "Replace File" : "Choose File"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(docType.key, e.target.files?.[0] || null)
                    }
                  />
                </label>

                {hasFile && (
                  <p className="text-xs text-green-600 mt-2">{hasFile.name}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allUploaded}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

const ReviewStatus: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Application Under Review
      </h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Thank you for submitting your verification application. Our team is
        currently reviewing your credentials and documents.
      </p>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Admin review: 1-2 business days</p>
          <p>• Background check: 3-5 business days</p>
          <p>• Final approval & activation: 1 business day</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
      >
        Start New Application
      </button>
    </div>
  );
};

// Main KYC Component
const NurseKycVerification: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
      title: "Document Submission",
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
      title: "Admin Review",
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
      title: "Background Check",
      description: "Verification of license and employment history",
      status: "pending",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Approval & Activation",
      description: "Account activation and welcome to platform",
      status: "pending",
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <KycIntroduction onStart={() => setCurrentStep(1)} />;
      case 1:
        return (
          <ProfessionalInfoForm
            data={personalInfo}
            onChange={setPersonalInfo}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <EmploymentInfoForm
            data={employmentInfo}
            onChange={setEmploymentInfo}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <DocumentUpload
            documents={documents}
            onChange={setDocuments}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return <ReviewStatus onRestart={() => setCurrentStep(0)} />;
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
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default NurseKycVerification;
