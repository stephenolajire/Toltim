import React from "react";
import { Eye, Mail, Phone, User } from "lucide-react";
import type { Patient } from "../../../types/patient";

interface PatientsTableProps {
  patients: Patient[];
  role:string
}

const PatientsTable: React.FC<PatientsTableProps> = ({ patients, role }) => {
  return (
    <div className="h-auto w-full pb-7">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {role.charAt(0).toUpperCase() + role.slice(1)}s List
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            All registered {role}s in the system ({patients.length} total)
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {patient.profile_picture ? (
                            <img
                              src={patient.profile_picture}
                              alt={patient.full_name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {patient.full_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {patient.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{patient.email_address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{patient.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {patient.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {patient.profile_picture ? (
                      <img
                        src={patient.profile_picture}
                        alt={patient.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {patient.full_name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {patient.role}
                    </span>
                  </div>
                </div>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View</span>
                </button>
              </div>

              {/* Patient Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">
                    {patient.email_address}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{patient.phone_number}</span>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  Patient ID: {patient.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;
