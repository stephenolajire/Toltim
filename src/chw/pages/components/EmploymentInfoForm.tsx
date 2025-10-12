import React from "react";
import { useFormik } from "formik";
import { type EmploymentInfo } from "../../../types/kyctypes";
import { employmentInfoSchema } from "../KYCValidation";

interface EmploymentInfoFormProps {
  initialData: EmploymentInfo;
  onNext: (data: EmploymentInfo) => void;
  onBack: () => void;
}

export const EmploymentInfoForm: React.FC<EmploymentInfoFormProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: employmentInfoSchema,
    onSubmit: (values) => {
      onNext(values);
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-green-600 mb-2">
        Employment Information
      </h2>
      <p className="text-gray-600 mb-6">
        Provide details about your current or recent employment
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                name="workplace"
                value={formik.values.workplace}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Lagos University Teaching Hospital"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.workplace && formik.errors.workplace
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.workplace && formik.errors.workplace && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.workplace}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Address *
              </label>
              <textarea
                name="workAddress"
                value={formik.values.workAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Complete address of workplace"
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.workAddress && formik.errors.workAddress
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.workAddress && formik.errors.workAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.workAddress}
                </p>
              )}
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
                name="biography"
                value={formik.values.biography}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe your experience, approach to patient care, and what makes you an excellent nurse..."
                rows={4}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.biography && formik.errors.biography
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {formik.touched.biography && formik.errors.biography && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.biography}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formik.values.biography.length}/500 characters
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact *
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formik.values.emergencyContact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Name and phone number of emergency contact"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formik.touched.emergencyContact &&
                  formik.errors.emergencyContact
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.emergencyContact &&
                formik.errors.emergencyContact && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.emergencyContact}
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
            Next: Upload Documents
          </button>
        </div>
      </form>
    </div>
  );
};