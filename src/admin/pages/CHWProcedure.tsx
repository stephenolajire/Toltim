import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useCHWProcedures } from "../../constant/GlobalContext";
import AddCaregiverType from "../components/procedures/AddCareGiver";
import EditCaregiverType from "../components/procedures/EditCareGiverType";
import api from "../../constant/api";
import { toast } from "react-toastify";

// Define types for the API response
interface CaregiverType {
  id: number;
  name: string;
  short_description: string;
  daily_rate: string;
  full_time_rate: string;
  features: string[];
  slug: string;
}

// interface CaregiverTypesResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: CaregiverType[];
// }

const CaregiverTypes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCaregiverType, setSelectedCaregiverType] =
    useState<CaregiverType | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { data, isLoading, refetch } = useCHWProcedures();

  console.log(data);

  // Function to handle editing caregiver type
  const handleEditCaregiverType = (caregiverType: CaregiverType) => {
    setSelectedCaregiverType(caregiverType);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCaregiverType(null);
  };

  // Function to handle deleting caregiver type
  const handleDeleteCaregiverType = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to delete this caregiver type?")
    ) {
      return;
    }

    setIsDeleting(id);
    try {
      await api.delete(`caregiver-type/${id}/`);
      // Invalidate and refetch the data
      refetch();
      toast.success("Caregiver type deleted successfully");
    } catch (error) {
      console.error("Error deleting caregiver type:", error);
      toast.error("Failed to delete caregiver type. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-auto">
        <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-8">
          <div className="py-5">
            <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
              Caregiver Types
            </h1>
            <p className="text-gray-500 mt-1">
              Manage caregiver types, pricing and features
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-black text-2xl capitalize">
              All Caregiver Types
            </h2>
            <p className="text-gray-500 mt-1">
              Manage and configure caregiver types
            </p>
          </div>

          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 text-lg mt-4">
              Loading caregiver types...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const caregiverTypes = data?.results || [];

  return (
    <div className="h-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-8">
        <div className="py-5">
          <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
            Caregiver Types
          </h1>
          <p className="text-gray-500 mt-1">
            Manage caregiver types, pricing and features
          </p>
        </div>
        <div className="px-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="hover:bg-black px-4 py-3 w-full bg-black/70 text-white flex space-x-3 rounded-lg items-center justify-center transition-colors"
          >
            <span>
              <Plus size={18} />
            </span>
            <span>Add Caregiver Type</span>
          </button>
        </div>
      </div>

      {/* Caregiver Types Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-black text-2xl capitalize">
            All Caregiver Types ({caregiverTypes.length})
          </h2>
          <p className="text-gray-500 mt-1">
            Manage and configure caregiver types
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search caregiver types..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="ml-4 px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {caregiverTypes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full-Time Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caregiverTypes.map((caregiverType: CaregiverType) => (
                  <tr
                    key={caregiverType.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caregiverType.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caregiverType.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-mono text-xs">
                        {caregiverType.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div
                        className="truncate"
                        title={caregiverType.short_description}
                      >
                        {caregiverType.short_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₦{parseFloat(caregiverType.daily_rate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ₦
                      {parseFloat(
                        caregiverType.full_time_rate
                      ).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(caregiverType.features) ? (
                              <>
                                {caregiverType.features
                                  .slice(0, 2)
                                  .map((feature: any, index: any) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                {caregiverType.features.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                    +{caregiverType.features.length - 2} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-500">
                                {caregiverType.features || "No features"}
                              </span>
                            )}
                          </div>
                        </td>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditCaregiverType(caregiverType)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit Caregiver Type"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCaregiverType(caregiverType.id)
                          }
                          disabled={isDeleting === caregiverType.id}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No caregiver types found</p>
            <p className="text-gray-400 mt-2">
              Add your first caregiver type to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Caregiver Type
            </button>
          </div>
        )}
      </div>

      {/* Add Caregiver Type Modal */}
      <AddCaregiverType
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Caregiver Type Modal */}
      <EditCaregiverType
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        caregiverType={selectedCaregiverType}
      />
    </div>
  );
};

export default CaregiverTypes;
