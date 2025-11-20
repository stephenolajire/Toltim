import React from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../../constant/api";
import { toast } from "react-toastify";
import { useSpecialization } from "../../../constant/GlobalContext";

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
  specialities: number[];
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
  specialities: Yup.array()
    .of(Yup.number())
    .min(1, "At least one speciality is required")
    .required("Specialities are required"),
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

const AddProcedureModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const initialValues: FormValues = {
    title: "",
    description: "",
    duration: "",
    price: "",
    repeated_visits: false,
    inclusions: [{ item: "" }],
    requirements: [{ item: "" }],
    specialities: [],
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
        specialties: values.specialities, // Note: backend uses 'specialties' not 'specialities'
        duration: values.duration,
        repeated_visits: values.repeated_visits,
        price: values.price,
        icon_url: "", // Add default or allow user to specify
        status: "active",
        inclusions: values.inclusions,
        requirements: values.requirements,
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
        toast.error(
          "Network error: Please check your connection and try again"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    onClose();
  };

  const { data: specialityData, isLoading: isSpecialityLoading } =
    useSpecialization();
  console.log("Speciality Data:", specialityData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, resetForm, isSubmitting }) => (
            <Form className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add New Procedure
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Fill in the details for the new nursing procedure.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCancel(resetForm)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-6">
                  {/* Procedure Title */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Procedure Title *
                    </label>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g., Blood Pressure Monitoring"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration *
                    </label>
                    <Field
                      id="duration"
                      name="duration"
                      type="text"
                      placeholder="e.g., 30 minutes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description *
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Provide a detailed description of the procedure..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Price and Repeat Visits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price (₦) *
                      </label>
                      <Field
                        id="price"
                        name="price"
                        type="text"
                        placeholder="e.g., 5000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Repeat Visits */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Repeat Visits Required? *
                      </label>
                      <div
                        role="group"
                        aria-labelledby="repeated_visits"
                        className="flex gap-4 mt-2"
                      >
                        <label className="flex items-center">
                          <Field
                            type="radio"
                            name="repeated_visits"
                            value="true"
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <Field
                            type="radio"
                            name="repeated_visits"
                            value="false"
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                      <ErrorMessage
                        name="repeated_visits"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Specialities */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Specialities *
                    </label>
                    {isSpecialityLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading specialities...</span>
                      </div>
                    ) : (
                      <Field name="specialities">
                        {({ field, form }: any) => (
                          <div className="space-y-2">
                            <select
                              multiple
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              style={{ minHeight: "120px" }}
                              value={field.value}
                              onChange={(e) => {
                                const options = e.target.options;
                                const selectedValues: number[] = [];
                                for (let i = 0; i < options.length; i++) {
                                  if (options[i].selected) {
                                    selectedValues.push(
                                      Number(options[i].value)
                                    );
                                  }
                                }
                                form.setFieldValue(
                                  "specialities",
                                  selectedValues
                                );
                              }}
                              onBlur={field.onBlur}
                            >
                              {specialityData?.results?.map(
                                (speciality: any) => (
                                  <option
                                    key={speciality.id}
                                    value={speciality.id}
                                  >
                                    {speciality.name}
                                  </option>
                                )
                              )}
                            </select>
                            <p className="text-xs text-gray-500">
                              Hold Ctrl (Windows) or Cmd (Mac) to select
                              multiple
                            </p>
                            {field.value.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {field.value.map((id: number) => {
                                  const speciality =
                                    specialityData?.results?.find(
                                      (s: any) => s.id === id
                                    );
                                  return speciality ? (
                                    <span
                                      key={id}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                    >
                                      {speciality.name}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newValues = field.value.filter(
                                            (v: number) => v !== id
                                          );
                                          form.setFieldValue(
                                            "specialities",
                                            newValues
                                          );
                                        }}
                                        className="hover:text-blue-900"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </Field>
                    )}
                    <ErrorMessage
                      name="specialities"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Inclusions *
                    </label>
                    <FieldArray name="inclusions">
                      {({ remove, push }) => (
                        <div className="space-y-3">
                          {values.inclusions.map((_, index) => (
                            <div key={index} className="flex gap-2">
                              <Field
                                name={`inclusions.${index}.item`}
                                placeholder={`Inclusion ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {values.inclusions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove inclusion"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <CustomErrorMessage name="inclusions" />
                          <button
                            type="button"
                            onClick={() => push({ item: "" })}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add Inclusion
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Requirements *
                    </label>
                    <FieldArray name="requirements">
                      {({ remove, push }) => (
                        <div className="space-y-3">
                          {values.requirements.map((_, index) => (
                            <div key={index} className="flex gap-2">
                              <Field
                                name={`requirements.${index}.item`}
                                placeholder={`Requirement ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {values.requirements.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove requirement"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <CustomErrorMessage name="requirements" />
                          <button
                            type="button"
                            onClick={() => push({ item: "" })}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add Requirement
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
