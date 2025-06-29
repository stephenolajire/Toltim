import React, { useState } from "react";
import {
  Search,
  Eye,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
} from "lucide-react";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  email: string;
  phone: string;
  role: string;
  license: string;
  submitted: string;
  documents: string;
  status: "pending" | "approved" | "under-review";
  avatar: string;
}

const Verification: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals] = useState<Professional[]>([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Critical Care",
      experience: "5 years",
      email: "sarah.johnson@email.com",
      phone: "+234 901 234 5678",
      role: "Nurse",
      license: "RN-12345-NG",
      submitted: "2024-06-20",
      documents: "License, Certificate, ID Card",
      status: "under-review",
      avatar: "👩‍⚕️",
    },
    {
      id: "2",
      name: "Nurse Mary Okafor",
      specialty: "Pediatric Care",
      experience: "8 years",
      email: "mary.okafor@email.com",
      phone: "+234 802 345 6789",
      role: "Nurse",
      license: "RN-67890-NG",
      submitted: "",
      documents: "",
      status: "approved",
      avatar: "👩‍⚕️",
    },
    {
      id: "3",
      name: "Grace Adebayo",
      specialty: "Community Health",
      experience: "3 years",
      email: "grace.adebayo@email.com",
      phone: "+234 803 456 7890",
      role: "Community Health Worker",
      license: "CHW-001-NG",
      submitted: "2024-06-22",
      documents: "Certificate, ID Card",
      status: "under-review",
      avatar: "👩‍⚕️",
    },
  ]);

  const verifiedCount = professionals.filter(
    (p) => p.status === "approved"
  ).length;
  const pendingCount = professionals.filter(
    (p) => p.status !== "approved"
  ).length;

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    console.log("Approve professional:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject professional:", id);
  };

  const handleViewDetails = (id: string) => {
    console.log("View details for professional:", id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            approved
          </span>
        );
      case "under-review":
        return (
          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
            under review
          </span>
        );
      default:
        return null;
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case "approved":
        return "border-l-green-500";
      case "under-review":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-100 py-6 sm:py-8">
      <div className="px-2 sm:px-4 md:px-8 lg:px-20 xl:px-50">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Professional Verifications
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-semibold text-sm sm:text-base">
                    {verifiedCount} Verified
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-700 font-semibold text-sm sm:text-base">
                    {pendingCount} Pending
                  </span>
                </div>
                <div className="text-gray-500 text-sm">
                  Total: {professionals.length} professionals
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, specialty, or role..."
                className="w-full lg:w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Professional Cards */}
        <div className="space-y-6">
          {filteredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl border-l-4 ${getCardBorderColor(
                professional.status
              )} p-6 lg:p-8 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Main Content */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
                      {professional.avatar}
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="flex-1 space-y-4">
                    {/* Name and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {professional.name}
                      </h3>
                      {getStatusBadge(professional.status)}
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
                        {professional.role}
                      </span>
                    </div>

                    {/* Specialty and Experience */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-700">
                      <span className="font-medium text-lg">
                        {professional.specialty}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">
                        {professional.experience} experience
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="break-all">{professional.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span>{professional.phone}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-700">
                            License:
                          </span>
                          <span className="text-gray-600 font-mono">
                            {professional.license}
                          </span>
                        </div>
                        {professional.submitted && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="font-medium text-gray-700">
                              Submitted:
                            </span>
                            <span className="text-gray-600">
                              {professional.submitted}
                            </span>
                          </div>
                        )}
                      </div>
                      {professional.documents && (
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-indigo-500 mt-0.5" />
                          <span className="font-medium text-gray-700">
                            Documents:
                          </span>
                          <span className="text-gray-600">
                            {professional.documents}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-fit">
                  {professional.status === "under-review" && (
                    <>
                      <button
                        onClick={() => handleApprove(professional.id)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <span>✓</span>
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(professional.id)}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <span>✗</span>
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewDetails(professional.id)}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfessionals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No professionals found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No professionals match your search criteria. Try adjusting your
              search terms or check back later for new submissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
