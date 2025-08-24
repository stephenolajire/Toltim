import React from "react";
import { Clock, MapPin, Eye, UserPlus } from "lucide-react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  time: string;
  location: string;
  status: "pending" | "assigned" | "active" | "completed";
  assignedNurse?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onAssignNurse: (appointmentId: string) => void;
  onViewDetails: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAssignNurse,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm w-full hover:shadow-md transition-shadow duration-200">
      {/* Header Section - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Patient Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-600 shrink-0">
            {appointment.patientId}
          </div>

          <div className="text-lg font-semibold text-gray-900 truncate">
            {appointment.patientName}
          </div>

          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize w-fit ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </div>
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
          {appointment.status !== "completed" && (
            <button
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              onClick={() => onAssignNurse(appointment.id)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                {appointment.assignedNurse ? "Reassign Nurse" : "Assign Nurse"}
              </span>
              <span className="sm:hidden">
                {appointment.assignedNurse ? "Reassign" : "Assign"}
              </span>
            </button>
          )}

          <button
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            onClick={() => onViewDetails(appointment.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </button>
        </div>
      </div>

      {/* Details Section - Responsive grid */}
      <div className="space-y-3 sm:space-y-0">
        {/* Appointment Type - Full width on mobile */}
        <div className="font-medium text-gray-900 text-base sm:text-sm mb-2 sm:mb-0">
          {appointment.appointmentType}
        </div>

        {/* Time, Location, and Nurse - Stack on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{appointment.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{appointment.location}</span>
          </div>

          {appointment.assignedNurse && (
            <div className="text-sm text-green-600 font-medium">
              Nurse:{" "}
              <span className="truncate">{appointment.assignedNurse}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
