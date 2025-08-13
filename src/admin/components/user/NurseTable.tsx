import React from "react";
import {
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

const NursesTable:React.FC = () => {
  const nurses = [
    {
      id: "NR001",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+234 805 678 9012",
      location: "Lagos",
      specialties: "General Care, Wound Care",
      rating: 4.9,
      verified: true,
      status: "verified",
    },
    {
      id: "NR002",
      name: "Michael Chen",
      email: "michael@email.com",
      phone: "+234 806 789 0123",
      location: "Abuja",
      specialties: "ICU Care, Critical Care",
      rating: 4.8,
      verified: true,
      status: "verified",
    },
    {
      id: "NR003",
      name: "Emily Rodriguez",
      email: "emily@email.com",
      phone: "+234 807 890 1234",
      location: "Ibadan",
      specialties: "Pediatric Care",
      rating: null,
      verified: false,
      status: "unverified",
    },
    {
      id: "NR004",
      name: "David Kim",
      email: "david@email.com",
      phone: "+234 808 901 2345",
      location: "Port Harcourt",
      specialties: "Elderly Care, Rehabilitation",
      rating: 4.7,
      verified: true,
      status: "verified",
    },
  ];

  const getVerificationBadge = (status:string, verified:boolean) => {
    if (status === "verified" && verified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
          <ShieldX className="w-3 h-3 mr-1" />
          Unverified
        </span>
      );
    }
  };

  const getRatingDisplay = (rating:number | null) => {
    if (rating) {
      return (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900">{rating}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-auto w-full pb-7">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Nurses
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            All registered nurses and their verification status
          </p>
        </div>

        {/* Nurses List */}
        <div className="space-y-4 sm:space-y-6">
          {nurses.map((nurse) => (
            <div
              key={nurse.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Nurse Header */}
              <div className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {nurse.id}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {nurse.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getVerificationBadge(nurse.status, nurse.verified)}
                    {getRatingDisplay(nurse.rating)}
                  </div>
                </div>

                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 items-center space-x-2 self-start sm:self-auto">
                  {nurse.status === "unverified" && (
                    <button className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors duration-200">
                      Verify
                    </button>
                  )}
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Profile</span>
                  </button>
                </div>
              </div>

              {/* Nurse Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Email */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{nurse.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{nurse.phone}</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{nurse.location}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-start space-x-2 text-gray-600">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Specialties:{" "}
                    </span>
                    <span className="text-sm">{nurse.specialties}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium">
            View More Nurses
          </button>
        </div>
      </div>
    </div>
  );
};

export default NursesTable;
