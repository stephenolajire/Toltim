import React from "react";
import { X, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../constant/api";
import { toast } from "react-toastify";

interface FormValues {
  code: string;
  name: string;
  description: string;
  price_per_day: string;
  is_active: boolean;
}

const validationSchema = Yup.object({
  code: Yup.string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be less than 20 characters")
    .required("Code is required"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  price_per_day: Yup.string()
    .matches(/^-?\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .required("Price per day is required"),
  is_active: Yup.boolean().required(),
});

const AddInbedProcedureModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const initialValues: FormValues = {
    code: "",
    name: "",
    description: "",
    price_per_day: "",
    is_active: true,
  };

  // Function to generate a random code
  const generateRandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setSubmitting(true);

      // Transform data to match backend format
      const payload = {
        code: values.code || generateRandomCode(), // Generate code if empty
        name: values.name,
        description: values.description,
        price_per_day: values.price_per_day,
        is_active: values.is_active,
      };

      const response = await api.post("inpatient-caregiver/services/", payload);
      console.log("Procedure created successfully:", response.data);

      // Reset form and close modal
      resetForm();
      onClose();

      // You might want to show a success toast here
      toast.success("Procedure added successfully!");
    } catch (error: any) {
      console.error("Error creating procedure:", error);

      // Handle different error scenarios
      if (error.response?.data) {
        console.error("Server error:", error.response.data);
        toast.error(
          `Error: ${
            error.response.data.message || "Failed to create procedure"
          }`
        );
      } else {
        toast.error("Network error: Please check your connection and try again");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({resetForm, isSubmitting, setFieldValue }) => (
            <Form>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Add New Procedure
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Fill in the details for the new nursing procedure.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCancel(resetForm)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Procedure Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Code *
                    </label>
                    <div className="flex gap-2">
                      <Field
                        name="code"
                        type="text"
                        placeholder="Enter procedure code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue("code", generateRandomCode())
                        }
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                        disabled={isSubmitting}
                      >
                        Generate
                      </button>
                    </div>
                    <ErrorMessage
                      name="code"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Procedure Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Name *
                    </label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter procedure name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    name="description"
                    as="textarea"
                    rows={4}
                    placeholder="Enter detailed procedure description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Price and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Per Day */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Per Day (₦) *
                    </label>
                    <Field
                      name="price_per_day"
                      type="text"
                      placeholder="Enter price per day"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="price_per_day"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Active Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Status *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <Field
                          name="is_active"
                          type="radio"
                          value={true}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Active
                        </span>
                      </label>
                      <label className="flex items-center">
                        <Field
                          name="is_active"
                          type="radio"
                          value={false}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Inactive
                        </span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="is_active"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => handleCancel(resetForm)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {isSubmitting ? "Creating..." : "Add Procedure"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddInbedProcedureModal;
