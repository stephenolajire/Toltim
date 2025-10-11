import React from "react";
import { Clock, MapPin, User, Stethoscope, MoreVertical } from "lucide-react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  time: string;
  location: string;
  status: "pending" | "assigned" | "active" | "completed" | "cancelled";
  assignedNurse?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onAssignNurse: (id: string, patientId:string) => void;
  onViewDetails: (id: string) => void;
  onApprove?: (id: string, patientId:string) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onAssignNurse,
  onViewDetails,
  onApprove,
  onCancel,
  isLoading = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canAssign =
    appointment.status === "pending" && !appointment.assignedNurse;
  const canApprove = appointment.status === "assigned";
  const canCancel = ["pending", "assigned"].includes(appointment.status);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {appointment.patientName}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {appointment.patientId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        onViewDetails(appointment.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    {canCancel && onCancel && (
                      <button
                        onClick={() => {
                          onCancel(appointment.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Stethoscope size={16} className="text-gray-400" />
              <span>{appointment.appointmentType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="text-gray-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              <span className="truncate">{appointment.location}</span>
            </div>
            {appointment.assignedNurse && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} className="text-gray-400" />
                <span>Worker: {appointment.assignedNurse}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {canAssign && (
              <button
                onClick={() => onAssignNurse(appointment.id, appointment.patientId)}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Assign Worker"}
              </button>
            )}
            {canApprove && onApprove && (
              <button
                onClick={() => onApprove(appointment.id, appointment.patientId)}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Approve"}
              </button>
            )}
            <button
              onClick={() => onViewDetails(appointment.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
