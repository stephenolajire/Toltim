import React, { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye} from "lucide-react";
import AddProcedureModal from "../components/procedures/AddProcedureModal";

// Define types for the procedure data
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

const Procedures: React.FC<ProceduresProps> = ({ procedures = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default data if none provided
  const defaultProcedures: Procedure[] = [
    {
      id: "PROC001",
      name: "Blood Pressure Check",
      description: "Routine blood pressure monitoring and assessment",
      amount: "₦3,000",
      repeatRequired: true,
      status: "active",
      created: "2024-01-10",
    },
    {
      id: "PROC002",
      name: "Wound Dressing",
      description: "Professional wound cleaning and dressing change",
      amount: "₦5,000",
      repeatRequired: true,
      status: "active",
      created: "2024-01-08",
    },
    {
      id: "PROC003",
      name: "Medication Administration",
      description: "Safe administration of prescribed medications",
      amount: "₦2,500",
      repeatRequired: false,
      status: "active",
      created: "2024-01-05",
    },
    {
      id: "PROC004",
      name: "Vital Signs Assessment",
      description:
        "Complete vital signs monitoring including temperature, pulse...",
      amount: "₦4,000",
      repeatRequired: true,
      status: "inactive",
      created: "2024-01-03",
    },
  ];

  const procedureData = procedures.length > 0 ? procedures : defaultProcedures;

  return (
    <div className="h-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-8">
        <div className="py-5">
          <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
            Procedures Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage nursing procedures, pricing and schedules
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
            All Procedures
          </h2>
          <p className="text-gray-500 mt-1">
            Manage and configure nursing procedures
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
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
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
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="View"
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

        {/* Empty State */}
        {procedureData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No procedures found</p>
            <p className="text-gray-400 mt-2">
              Add your first procedure to get started
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Procedures;
