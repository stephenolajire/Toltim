import React from "react";
import { MapPin, Clock, FileText, Download } from "lucide-react";
import PatientAssessmentModal from "../components/FullAccessModal";

interface PatientRequest {
  id: string;
  name: string;
  age: number;
  condition: string;
  location: string;
  distance: string;
  timeAgo: string;
  urgency: "Routine" | "Same Day" | "Urgent";
  price: number;
  assessmentSummary: string;
  hasTestResults: boolean;
  status: "pending" | "accepted";
}

const NurseDashboard: React.FC = () => {
  const requests: PatientRequest[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 34,
      condition: "Post-surgical wound care",
      location: "Victoria Island, Lagos",
      distance: "2.3 km",
      timeAgo: "2 hours ago",
      urgency: "Routine",
      price: 8000,
      assessmentSummary: "Minor post-operative care needed for surgical wound",
      hasTestResults: true,
      status: "accepted",
    },
    {
      id: "2",
      name: "Michael Adebayo",
      age: 45,
      condition: "Diabetes management",
      location: "Ikoyi, Lagos",
      distance: "3.1 km",
      timeAgo: "30 minutes ago",
      urgency: "Same Day",
      price: 10000,
      assessmentSummary:
        "Blood sugar monitoring and insulin administration needed",
      hasTestResults: true,
      status: "pending",
    },
    {
      id: "3",
      name: "Grace Okafor",
      age: 28,
      condition: "Prenatal care",
      location: "Lekki Phase 1, Lagos",
      distance: "5.2 km",
      timeAgo: "1 hour ago",
      urgency: "Routine",
      price: 7500,
      assessmentSummary: "Routine prenatal checkup and health monitoring",
      hasTestResults: false,
      status: "pending",
    },
  ];

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case "Routine":
        return "bg-green-100 text-green-800";
      case "Same Day":
        return "bg-yellow-100 text-yellow-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="w-full pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        New Patient Requests
      </h1>

      <div className="space-y-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white border-l-4 border-green-400 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {request.name}, {request.age} years
                  </h3>
                  <p className="text-gray-700 font-medium mb-3">
                    {request.condition}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {request.location} ({request.distance})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{request.timeAgo}</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyBadgeColor(
                        request.urgency
                      )}`}
                    >
                      {request.urgency}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatPrice(request.price)}
                  </div>
                  <div className="text-sm text-gray-500">per session</div>
                </div>
              </div>

              {/* Assessment Summary */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Assessment Summary
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {request.assessmentSummary}
                </p>
              </div>

              {/* Test Results */}
              {request.hasTestResults && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>Test results available</span>
                    <button className="flex items-center gap-1 ml-2 text-green-600 hover:text-green-700 transition-colors">
                      <Download className="h-4 w-4" />
                      <span>View Results</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {request.status === "accepted" ? (
                  <button
                    disabled
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium cursor-not-allowed"
                  >
                    Request Accepted
                  </button>
                ) : (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
                    Accept Request
                  </button>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  View Full Assessment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PatientAssessmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Empty State (if no requests) */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No new patient requests
          </h3>
          <p className="text-gray-500">
            New requests will appear here when patients book your services.
          </p>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
