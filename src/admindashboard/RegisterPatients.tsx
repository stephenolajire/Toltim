import React, { useState } from "react";
import { Eye } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  registeredDate: string;
  totalSpent: number;
  currency: string;
  bookingsCount: number;
}

const RegisteredPatients: React.FC = () => {
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Alice Johnson",
      initials: "AJ",
      email: "alice.j@email.com",
      phone: "+234 901 111 2222",
      registeredDate: "2024-06-20",
      totalSpent: 75000,
      currency: "₦",
      bookingsCount: 3,
    },
    {
      id: "2",
      name: "Bob Smith",
      initials: "BS",
      email: "bob.smith@email.com",
      phone: "+234 802 333 4444",
      registeredDate: "2024-06-18",
      totalSpent: 25000,
      currency: "₦",
      bookingsCount: 1,
    },
  ]);

  const handleViewProfile = (patientId: string) => {
    console.log("Viewing profile for patient:", patientId);
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency}${amount.toLocaleString()}`;
  };

  const getBookingsText = (count: number) => {
    return count === 1 ? "1 booking" : `${count} bookings`;
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen px-2 sm:px-4 md:px-8 lg:px-20 xl:px-50">
      <div className="py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            Registered Patients
          </h1>
        </div>

        {/* Patient Cards */}
        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex flex-row lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section - Patient Details */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base lg:text-lg">
                      {patient.initials}
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                      {patient.name}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600 mb-3">
                      <span className="break-all sm:break-normal">
                        {patient.email}
                      </span>
                      <span className="hidden sm:inline text-gray-400">•</span>
                      <span>{patient.phone}</span>
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      <span className="font-medium">Registered:</span>
                      <span className="ml-1">{patient.registeredDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Stats and Actions */}
                <div className="flex flex-col items-end gap-4 lg:gap-6">
                  {/* Stats */}
                  <div className="text-left sm:text-right lg:text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {formatAmount(patient.totalSpent, patient.currency)}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {getBookingsText(patient.bookingsCount)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="w-full sm:w-auto">
                    <button
                      onClick={() => handleViewProfile(patient.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {patients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No patients found</div>
            <div className="text-gray-500 text-sm">
              Registered patients will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredPatients;
