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
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600">
            {appointment.patientId}
          </div>

          <div className="text-lg font-semibold text-gray-900">
            {appointment.patientName}
          </div>

          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {appointment.status !== "completed" && (
            <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => onAssignNurse(appointment.id)}
            // disabled={appointment.status === "completed"}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {appointment.assignedNurse ? "Reassign Nurse" : "Assign Nurse"}
          </button>
          )}

          <button
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => onViewDetails(appointment.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
        <div className="font-medium text-gray-900">
          {appointment.appointmentType}
        </div>

        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>

        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4" />
          <span>{appointment.location}</span>
        </div>

        {appointment.assignedNurse && (
          <div className="text-sm text-blue-600">
            Nurse: {appointment.assignedNurse}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
