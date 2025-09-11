import React from "react";
import { useFormik } from "formik";
import { type PersonalInfo } from "../../../types/kyctypes";
import {personalInfoSchema} from "../KYCValidation"

interface ProfessionalInfoFormProps {
  initialData: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
  onBack: () => void;
}

export const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: personalInfoSchema,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Application Form
      </h2>
      <p className="text-gray-600 mb-6">
        Complete your professional verification details
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                name="licenseNumber"
                value={formik.values.licenseNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="RN-12345"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.licenseNumber && formik.errors.licenseNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.licenseNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <select
                  name="yearsExperience"
                  value={formik.values.yearsExperience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formik.touched.yearsExperience &&
                    formik.errors.yearsExperience
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select years</option>
                  <option value="1-2">1-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                {formik.touched.yearsExperience &&
                  formik.errors.yearsExperience && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.yearsExperience}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  name="specialization"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    formik.touched.specialization &&
                    formik.errors.specialization
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select specialty</option>
                  <option value="critical-care">Critical Care</option>
                  <option value="emergency">Emergency</option>
                  <option value="pediatric">Pediatric</option>
                  <option value="surgical">Surgical</option>
                  <option value="general">General Nursing</option>
                </select>
                {formik.touched.specialization &&
                  formik.errors.specialization && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.specialization}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nursing School/Institution *
              </label>
              <input
                type="text"
                name="nursingSchool"
                value={formik.values.nursingSchool}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="University of Lagos, College of Medicine"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.nursingSchool && formik.errors.nursingSchool
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.nursingSchool && formik.errors.nursingSchool && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.nursingSchool}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year *
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formik.values.graduationYear}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="2020"
                min="1980"
                max="2025"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.graduationYear && formik.errors.graduationYear
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.graduationYear &&
                formik.errors.graduationYear && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.graduationYear}
                  </p>
                )}
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
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next: Employment Details
          </button>
        </div>
      </form>
    </div>
  );
};
