import React from "react";
import { X } from "lucide-react";

// API Response Types
interface APIProcedure {
  id: string;
  code: string;
  name: string;
  description: string;
  price_per_day: string;
  is_active: boolean;
}

interface ViewProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: APIProcedure | null;
}

const ViewInBedProcedureModal: React.FC<ViewProcedureModalProps> = ({
  isOpen,
  onClose,
  procedure,
}) => {
  if (!isOpen || !procedure) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Procedure Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              View details for "{procedure.name}"
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                Procedure Code
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {procedure.code}
              </div>
            </div>

            {/* Procedure Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedure Name
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {procedure.name}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[100px]">
              {procedure.description}
            </div>
          </div>

          {/* Price and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Per Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Day
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                ₦{parseFloat(procedure.price_per_day).toLocaleString()}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    procedure.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {procedure.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Procedure Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">ID:</span> {procedure.id}
              </div>
              <div>
                <span className="font-medium">Type:</span> In-Bed Procedure
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInBedProcedureModal;
