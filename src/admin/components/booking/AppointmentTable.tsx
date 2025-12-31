import React from "react";
import { Clock, User, Stethoscope, Eye } from "lucide-react";
import LocationDisplay from "../../../components/LocationDisplay";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  time: string;
  location: string;
  status:
    | "pending"
    | "assigned"
    | "active"
    | "completed"
    | "cancelled"
    | "rejected";
  assignedNurse?: string;
}

interface AppointmentTableProps {
  appointments: Appointment[];
  onAssignNurse: (id: string, patientId: string) => void;
  onViewDetails: (id: string) => void;
  onApprove?: (id: string, patientId: string) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onAssignNurse,
  onViewDetails,
  onCancel,
  isLoading = false,
}) => {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  console.log(activeMenu);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
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

  const canAssign = (appointment: Appointment) =>
    (appointment.status === "pending" || appointment.status === "rejected") &&
    !appointment.assignedNurse;
  const canCancel = (appointment: Appointment) =>
    ["pending", "assigned"].includes(appointment.status);

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Patient Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Appointment Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Assigned Worker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {appointment.patientName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {appointment.patientId}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Stethoscope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{appointment.appointmentType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 max-w-xs">
                        <LocationDisplay location={appointment.location} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {appointment.assignedNurse ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{appointment.assignedNurse}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {canAssign(appointment) && (
                          <button
                            onClick={() =>
                              onAssignNurse(
                                appointment.id,
                                appointment.patientId
                              )
                            }
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {isLoading ? "Processing..." : "Assign"}
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetails(appointment.id)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        {appointment.status === "rejected" && (
                          <button
                            onClick={() =>
                              onAssignNurse(
                                appointment.id,
                                appointment.patientId
                              )
                            }
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {isLoading ? "Processing..." : "Assign"}
                          </button>
                        )}
                        {canCancel(appointment) && onCancel && (
                          <button
                            onClick={() => onCancel(appointment.id)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {isLoading ? "Processing..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {appointments.length > 0 && (
        <div className="mt-2 pb-2 text-xs text-gray-500 text-center sm:hidden">
          Scroll horizontally to see all columns →
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
