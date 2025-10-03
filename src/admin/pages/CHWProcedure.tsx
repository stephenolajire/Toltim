import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import EditProcedureModal from "../components/procedures/EditProcedureModal";
import { useNurseProcedures } from "../../constant/GlobalContext";
import AddCaregiverType from "../components/procedures/AddCareGiver";

// Define types for the API response
interface APIInclusionItem {
  id: number;
  item: string;
}

interface APIRequirementItem {
  id: number;
  item: string;
}

interface APIProcedure {
  id: number;
  procedure_id: string;
  title: string;
  description: string;
  duration: string;
  repeated_visits: boolean;
  price: string;
  icon_url: string | null;
  status: "active" | "inactive";
  inclusions: APIInclusionItem[];
  requirements: APIRequirementItem[];
  created_at: string;
  updated_at: string;
}

// Define types for the component's internal procedure data
interface Procedure {
  id: string;
  name: string;
  description: string;
  amount: string;
  repeatRequired: boolean;
  status: "active" | "inactive";
  created: string;
}

interface ProceduresProps {
  procedures?: Procedure[];
}

const CareProcedures: React.FC<ProceduresProps> = ({ procedures = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | null>(
    null
  );
  const { data, isLoading } = useNurseProcedures();

  // Function to transform API data to component format
  const transformProcedureData = (
    apiProcedures: APIProcedure[]
  ): Procedure[] => {
    return apiProcedures.map((procedure) => ({
      id: procedure.procedure_id,
      name: procedure.title,
      description: procedure.description,
      amount: `₦${parseFloat(procedure.price).toLocaleString()}`,
      repeatRequired: procedure.repeated_visits,
      status: procedure.status,
      created: new Date(procedure.created_at).toLocaleDateString("en-GB"), // Format: DD/MM/YYYY
    }));
  };

  // Determine which data to use
  const getProcedureData = (): Procedure[] => {
    // If props procedures are provided, use them
    if (procedures.length > 0) {
      return procedures;
    }

    // If API data is available, transform and use it
    if (data?.results && data.results.length > 0) {
      return transformProcedureData(data.results);
    }

    return []
  };

  const procedureData = getProcedureData();

  // Function to handle viewing procedure details
  const handleViewProcedureDetails = (procedureId: string) => {
    // Find the corresponding API procedure by procedure_id
    const apiProcedure = data?.results?.find(
      (p:any) => p.procedure_id === procedureId
    );
    if (apiProcedure) {
      setSelectedProcedureId(apiProcedure.id);
      setIsDetailModalOpen(true);
    }
  };

  // Function to handle editing procedure
  const handleEditProcedure = (procedureId: string) => {
    // Find the corresponding API procedure by procedure_id
    const apiProcedure = data?.results?.find(
      (p:any) => p.procedure_id === procedureId
    );
    if (apiProcedure) {
      setSelectedProcedureId(apiProcedure.id);
      setIsEditModalOpen(true);
    }
  };

  // Function to get the selected procedure from API data
  const getSelectedProcedure = (): APIProcedure | null => {
    if (!data?.results || !selectedProcedureId) return null;
    return (
      data.results.find((procedure:any) => procedure.id === selectedProcedureId) ||
      null
    );
  };

  // Function to close the detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProcedureId(null);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProcedureId(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-auto">
        <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-8">
          <div className="py-5">
            <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
              CareGiver Procedures
            </h1>
            <p className="text-gray-500 mt-1">
              Manage CareGiver procedures, pricing and schedules
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-black text-2xl capitalize">
              All Procedures
            </h2>
            <p className="text-gray-500 mt-1">
              Manage and configure CareGiver procedures
            </p>
          </div>

          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 text-lg mt-4">Loading procedures...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-8">
        <div className="py-5">
          <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
             CareGiver Procedures
          </h1>
          <p className="text-gray-500 mt-1">
            Manage CareGiver procedures, pricing and schedules
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
            <span>Add Procedure</span>
          </button>
        </div>
      </div>

      {/* Procedures Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-black text-2xl capitalize">
            All Procedures ({procedureData.length})
          </h2>
          <p className="text-gray-500 mt-1">
            Manage and configure CareGiver procedures
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
                placeholder="Search procedures..."
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
        {procedureData.length > 0 ? (
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
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repeat Required
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {procedureData.map((procedure) => (
                  <tr
                    key={procedure.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {procedure.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {procedure.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={procedure.description}>
                        {procedure.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {procedure.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          procedure.repeatRequired
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {procedure.repeatRequired ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          procedure.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {procedure.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {procedure.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditProcedure(procedure.id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit Procedure"
                          disabled={!data?.results} // Disable if no API data
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleViewProcedureDetails(procedure.id)
                          }
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          title="View Details"
                          disabled={!data?.results} // Disable if no API data
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
            <p className="text-gray-500 text-lg">No procedures found</p>
            <p className="text-gray-400 mt-2">
              Add your first procedure to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Procedure
            </button>
          </div>
        )}
      </div>

      {/* Add Procedure Modal */}
      <AddCaregiverType
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Procedure Modal */}
      <EditProcedureModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        procedure={getSelectedProcedure()}
      />

      {/* Procedure Detail Modal */}
      <AddCaregiverType
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        // procedure={getSelectedProcedure()}
      />
    </div>
  );
};

export default CareProcedures;
