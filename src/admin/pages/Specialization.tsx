import React, { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../constant/api";
import { toast } from "react-toastify";

interface Specialty {
  id: number;
  name: string;
}

interface SpecialtyFormValues {
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Specialty name must be at least 2 characters")
    .max(50, "Specialty name must be less than 50 characters")
    .required("Specialty name is required"),
});

// Add/Edit Modal Component
const SpecialtyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  specialty: Specialty | null;
  mode: "add" | "edit";
}> = ({ isOpen, onClose, specialty, mode }) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (data: SpecialtyFormValues) => {
      const response = await api.post("/user/specialties/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      toast.success("Specialty added successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add specialty");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: SpecialtyFormValues) => {
      if (!specialty) throw new Error("No specialty to update");
      const response = await api.patch(
        `/user/specialties/${specialty.id}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      toast.success("Specialty updated successfully!");
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update specialty"
      );
    },
  });

  if (!isOpen) return null;

  const initialValues: SpecialtyFormValues = {
    name: specialty?.name || "",
  };

  const handleSubmit = async (
    values: SpecialtyFormValues,
    { setSubmitting }: any
  ) => {
    try {
      if (mode === "add") {
        await addMutation.mutateAsync(values);
      } else {
        await editMutation.mutateAsync(values);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, resetForm }) => (
            <Form>
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === "add" ? "Add New Specialty" : "Edit Specialty"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === "add"
                    ? "Create a new medical specialty"
                    : "Update specialty information"}
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specialty Name *
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Cardiology, Pediatrics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting
                    ? mode === "add"
                      ? "Adding..."
                      : "Updating..."
                    : mode === "add"
                    ? "Add Specialty"
                    : "Update Specialty"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  specialty: Specialty | null;
  isDeleting: boolean;
}> = ({ isOpen, onClose, onConfirm, specialty, isDeleting }) => {
  if (!isOpen || !specialty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Delete Specialty</h2>
          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{specialty.name}</span>? This action
            cannot be undone.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SpecialtiesManagement: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  // Fetch specialties
  const {
    data: specialtiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const response = await api.get("/user/specialties/");
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/user/specialties/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      toast.success("Specialty deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedSpecialty(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete specialty"
      );
    },
  });

  const handleEdit = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSpecialty) {
      deleteMutation.mutate(selectedSpecialty.id);
    }
  };

  // Filter specialties based on search
  const filteredSpecialties = specialtiesData?.results?.filter(
    (specialty: Specialty) =>
      specialty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Medical Specialties
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all medical specialties in the system
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Specialty
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600 mt-4">Loading specialties...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-red-600">Failed to load specialties</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["specialties"] })
              }
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredSpecialties && filteredSpecialties.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSpecialties.map((specialty: Specialty) => (
                    <tr
                      key={specialty.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {specialty.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
                            {specialty.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {specialty.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(specialty)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit specialty"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(specialty)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete specialty"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total: {filteredSpecialties.length} specialt
                {filteredSpecialties.length === 1 ? "y" : "ies"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">
              {searchQuery
                ? "No specialties found matching your search"
                : "No specialties available"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Specialty
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <SpecialtyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        specialty={null}
        mode="add"
      />

      <SpecialtyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSpecialty(null);
        }}
        specialty={selectedSpecialty}
        mode="edit"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSpecialty(null);
        }}
        onConfirm={handleDeleteConfirm}
        specialty={selectedSpecialty}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default SpecialtiesManagement;
