import React from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../constant/api";
import { toast } from "react-toastify";

interface InclusionItem {
  item: string;
}

interface RequirementItem {
  item: string;
}

interface FormValues {
  title: string;
  description: string;
  duration: string;
  price: string;
  repeated_visits: boolean;
  inclusions: InclusionItem[];
  requirements: RequirementItem[];
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  duration: Yup.string().required("Duration is required"),
  price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid number")
    .required("Price is required"),
  repeated_visits: Yup.boolean().required(),
  inclusions: Yup.array()
    .of(
      Yup.object({
        item: Yup.string()
          .min(3, "Inclusion must be at least 3 characters")
          .required("Inclusion item is required"),
      })
    )
    .min(1, "At least one inclusion is required"),
  requirements: Yup.array()
    .of(
      Yup.object({
        item: Yup.string()
          .min(3, "Requirement must be at least 3 characters")
          .required("Requirement item is required"),
      })
    )
    .min(1, "At least one requirement is required"),
});

// Custom error message component for array fields
const CustomErrorMessage: React.FC<{ name: string }> = ({ name }) => {
  return (
    <ErrorMessage name={name}>
      {(errorMessage: string | string[] | Record<string, any>) => {
        let displayMessage = "";

        if (typeof errorMessage === "string") {
          displayMessage = errorMessage;
        } else if (Array.isArray(errorMessage)) {
          const firstError = errorMessage.find(
            (error: string) => error && typeof error === "string"
          );
          displayMessage = firstError || "";
        } else if (typeof errorMessage === "object" && errorMessage !== null) {
          displayMessage = "Please check the required fields";
        }

        return displayMessage ? (
          <div className="text-red-500 text-sm mt-1">{displayMessage}</div>
        ) : null;
      }}
    </ErrorMessage>
  );
};


const AddProcedureModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const initialValues: FormValues = {
    title: "",
    description: "",
    duration: "",
    price: "",
    repeated_visits: false,
    inclusions: [{ item: "" }],
    requirements: [{ item: "" }],
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setSubmitting(true);

      // Transform data to match backend format
      const payload = {
        title: values.title,
        description: values.description,
        duration: values.duration,
        repeated_visits: values.repeated_visits,
        price: values.price,
        inclusions: values.inclusions,
        requirements: values.requirements,
        status: "active",
      };

      const response = await api.post("services/nursing-procedures/", payload);
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, resetForm, isSubmitting }) => (
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
                  {/* Procedure Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Title *
                    </label>
                    <Field
                      name="title"
                      type="text"
                      placeholder="Enter procedure title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <Field
                      name="duration"
                      type="text"
                      placeholder="e.g., 30 minutes, 1 hour"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="duration"
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

                {/* Price and Repeat Visits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₦) *
                    </label>
                    <Field
                      name="price"
                      type="text"
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Repeat Visits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Repeat Visits Required? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <Field
                          name="repeated_visits"
                          type="radio"
                          value="true"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <Field
                          name="repeated_visits"
                          type="radio"
                          value="false"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="repeated_visits"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Inclusions *
                  </label>
                  <FieldArray name="inclusions">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.inclusions.map((_, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <Field
                                name={`inclusions.${index}.item`}
                                type="text"
                                placeholder={`Inclusion ${index + 1}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                              />
                              <ErrorMessage
                                name={`inclusions.${index}.item`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                            {values.inclusions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove inclusion"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ item: "" })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Plus size={16} />
                          Add Inclusion
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <CustomErrorMessage name="inclusions" />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Requirements *
                  </label>
                  <FieldArray name="requirements">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.requirements.map((_, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <Field
                                name={`requirements.${index}.item`}
                                type="text"
                                placeholder={`Requirement ${index + 1}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                              />
                              <ErrorMessage
                                name={`requirements.${index}.item`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                            {values.requirements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove requirement"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ item: "" })}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          <Plus size={16} />
                          Add Requirement
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  <CustomErrorMessage name="requirements" />
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

export default AddProcedureModal;
