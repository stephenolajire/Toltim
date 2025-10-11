import React from "react";
import { X, Loader2, RefreshCw } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../constant/api";
import { toast } from "react-toastify";

interface CaregiverType {
  id: number;
  name: string;
  short_description: string;
  daily_rate: string;
  full_time_rate: string;
  features: string[] | string;
  slug: string;
}

interface FormValues {
  name: string;
  short_description: string;
  daily_rate: string;
  full_time_rate: string;
  features: string;
  slug: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters")
    .required("Name is required"),
  short_description: Yup.string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description must be less than 500 characters")
    .required("Short description is required"),
  daily_rate: Yup.string()
    .matches(/^-?\d+(\.\d{1,2})?$/, "Daily rate must be a valid number")
    .required("Daily rate is required"),
  full_time_rate: Yup.string()
    .matches(/^-?\d+(\.\d{1,2})?$/, "Full-time rate must be a valid number")
    .required("Full-time rate is required"),
  features: Yup.string()
    .min(10, "Features must be at least 10 characters")
    .max(1000, "Features must be less than 1000 characters")
    .required("Features are required"),
  slug: Yup.string()
    .length(3, "Slug must be exactly 10 characters")
    .matches(/^[a-zA-Z0-9]+$/, "Slug must contain only letters and numbers")
    .required("Slug is required"),
});

// Function to generate a random 10-character slug
const generateSlug = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 10; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};

interface EditCaregiverTypeProps {
  isOpen: boolean;
  onClose: () => void;
  caregiverType: CaregiverType | null;
}

const EditCaregiverType: React.FC<EditCaregiverTypeProps> = ({
  isOpen,
  onClose,
  caregiverType,
}) => {
  const queryClient = useQueryClient();

  // Mutation for updating caregiver type
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; payload: any }) => {
      const response = await api.patch(
        `caregiver-type/${data.id}/`,
        data.payload
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch caregiver types
      queryClient.invalidateQueries({ queryKey: ["caregiverTypes"] });
      toast.success("Caregiver type updated successfully!");
      onClose();
    },
    onError: (error: any) => {
      console.error("Error updating caregiver type:", error);
      if (error.response?.data) {
        toast.error(
          `Error: ${
            error.response.data.message || "Failed to update caregiver type"
          }`
        );
      } else {
        toast.error(
          "Network error: Please check your connection and try again"
        );
      }
    },
  });

  if (!isOpen || !caregiverType) return null;

  // Convert features to string - handle both array and string formats
  const featuresString = Array.isArray(caregiverType.features)
    ? caregiverType.features.join(", ")
    : caregiverType.features;

  const initialValues: FormValues = {
    name: caregiverType.name,
    short_description: caregiverType.short_description,
    daily_rate: caregiverType.daily_rate,
    full_time_rate: caregiverType.full_time_rate,
    features: featuresString,
    slug: caregiverType.slug,
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      setSubmitting(true);

      // Transform data to match backend format
      const payload = {
        name: values.name,
        short_description: values.short_description,
        daily_rate: values.daily_rate,
        full_time_rate: values.full_time_rate,
        features: values.features,
        slug: values.slug,
      };

      await updateMutation.mutateAsync({
        id: caregiverType.id,
        payload,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ resetForm, isSubmitting, setFieldValue}) => (
            <Form>
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Caregiver Type
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update the details for this caregiver type.
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caregiver Type Name *
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="e.g., Registered Nurse, Home Care Assistant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <div className="flex gap-2">
                    <Field
                      name="slug"
                      type="text"
                      placeholder="Click generate to create slug"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setFieldValue("slug", generateSlug())}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Generate
                    </button>
                  </div>
                  <ErrorMessage
                    name="slug"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A unique 10-character identifier for this caregiver type
                  </p>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <Field
                    name="short_description"
                    as="textarea"
                    rows={3}
                    placeholder="Enter a brief description of this caregiver type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                  <ErrorMessage
                    name="short_description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate (₦) *
                    </label>
                    <Field
                      name="daily_rate"
                      type="text"
                      placeholder="Enter daily rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="daily_rate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Full Time Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full-Time Rate (₦) *
                    </label>
                    <Field
                      name="full_time_rate"
                      type="text"
                      placeholder="Enter full-time rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    />
                    <ErrorMessage
                      name="full_time_rate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features *
                  </label>
                  <Field
                    name="features"
                    as="textarea"
                    rows={5}
                    placeholder="Enter the key features and responsibilities of this caregiver type (separate with commas)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                  <ErrorMessage
                    name="features"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    List the main features, skills, or responsibilities
                    (comma-separated)
                  </p>
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
                  {isSubmitting ? "Updating..." : "Update Caregiver Type"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditCaregiverType;
