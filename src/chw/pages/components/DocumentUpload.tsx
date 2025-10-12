import React from "react";
import { useFormik } from "formik";
import { CheckCircle, User, FileText, Award } from "lucide-react";
import { type RequiredDocuments } from "../../../types/kyctypes";
import { documentsSchema } from "../KYCValidation";

interface DocumentUploadProps {
  initialData: RequiredDocuments;
  onNext: (data: RequiredDocuments) => void;
  onBack: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: documentsSchema,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  const handleFileChange = (
    key: keyof RequiredDocuments,
    file: File | null
  ) => {
    formik.setFieldValue(key, file);
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Required Documents
      </h2>
      <p className="text-gray-600 mb-6">
        Upload clear, legible copies of the following documents (Max 5MB each):
      </p>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {documentTypes.map((docType) => {
            const IconComponent = docType.icon;
            const hasFile = formik.values[docType.key];
            const fieldError = formik.errors[docType.key] as string;
            const fieldTouched = formik.touched[docType.key];

            return (
              <div
                key={docType.key}
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-green-300 transition-colors ${
                  fieldTouched && fieldError
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
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
                        handleFileChange(
                          docType.key,
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>

                  {hasFile && (
                    <p className="text-xs text-green-600 mt-2">
                      {hasFile.name}
                    </p>
                  )}

                  {fieldTouched && fieldError && (
                    <p className="text-red-500 text-xs mt-2">{fieldError}</p>
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
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {formik.isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};