import React, { useState } from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  treatmentType: string;
  date: string;
  time: string;
  status: "completed" | "treated" | "cancelled";
}

const Appointments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"recent" | "treated">("recent");

  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      treatmentType: "Wound care",
      date: "2024-06-28",
      time: "2:00 PM",
      status: "completed",
    },
    {
      id: "4",
      patientName: "Sarah Johnson",
      treatmentType: "Wound care",
      date: "2024-06-28",
      time: "2:00 PM",
      status: "treated",
    },
    {
      id: "2",
      patientName: "Michael Adebayo",
      treatmentType: "Diabetes monitoring",
      date: "2024-06-27",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: "3",
      patientName: "Grace Okafor",
      treatmentType: "Prenatal checkup",
      date: "2024-06-26",
      time: "3:30 PM",
      status: "completed",
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const filteredAppointments =
    activeTab === "recent"
      ? appointments.filter((apt) => apt.status === "completed")
      : appointments.filter((apt) => apt.status === "treated");

  return (
    <div className="bg-white rounded-lg  mb-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointments</h2>

      {/* Tab Navigation */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "recent"
              ? "border-gray-900 text-gray-900 bg-gray-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Recent Appointments
        </button>
        <button
          onClick={() => setActiveTab("treated")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "treated"
              ? "border-gray-900 text-gray-900 bg-gray-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Treated Patients
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  {appointment.patientName}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {appointment.treatmentType}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>

              {appointment.status === "completed" ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">treated</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
