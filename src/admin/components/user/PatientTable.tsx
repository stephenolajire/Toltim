import React from "react";
import { Eye, Mail, Phone, MapPin, Calendar, Users } from "lucide-react";

const PatientsTable:React.FC = () => {
  const patients = [
    {
      id: "PT001",
      name: "John Doe",
      email: "john@email.com",
      phone: "+234 801 234 5678",
      location: "Lagos",
      joinDate: "2024-01-15",
      bookings: 5,
    },
    {
      id: "PT002",
      name: "Jane Smith",
      email: "jane@email.com",
      phone: "+234 802 345 6789",
      location: "Abuja",
      joinDate: "2024-02-20",
      bookings: 3,
    },
    {
      id: "PT003",
      name: "Mike Wilson",
      email: "mike@email.com",
      phone: "+234 803 456 7890",
      location: "Port Harcourt",
      joinDate: "2024-03-10",
      bookings: 8,
    },
    {
      id: "PT004",
      name: "Alice Brown",
      email: "alice@email.com",
      phone: "+234 804 567 8901",
      location: "Kano",
      joinDate: "2024-01-28",
      bookings: 2,
    },
  ];

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="h-auto w-full pb-7">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Patients
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            All registered patients in the system
          </p>
        </div>

        {/* Patients List */}
        <div className="space-y-4 sm:space-y-6">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Patient Header */}
              <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {patient.id}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {patient.name}
                  </h3>
                </div>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 self-start sm:self-auto">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">View Profile</span>
                </button>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Email */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{patient.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{patient.phone}</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{patient.location}</span>
                </div>

                {/* Join Date */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    Joined {formatDate(patient.joinDate)}
                  </span>
                </div>
              </div>

              {/* Bookings Count */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {patient.bookings} bookings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium">
            View More Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;
