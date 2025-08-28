import { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import HistoryNavigation from "./HistoryNav";
import PatientAppointmentHistoryCard from "./AppointmentHistoryCard";

// Sample appointment data based on your images
const sampleAppointments = [
  {
    id: 1,
    doctor: {
      name: "CHW Peter Nwankwo",
      specialty: "Community Health",
      avatar: "P",
    },
    date: "7/20/2025",
    time: "9:00 AM",
    location: "Onitsha South",
    consultationType: "In-Person Consultation",
    fee: 3000,
    status: "rejected",
    rejectionReason: "Provider unavailable due to emergency",
  },
  {
    id: 2,
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Gynecologist",
      avatar: "S",
    },
    date: "7/18/2025",
    time: "11:00 AM",
    location: "Onitsha Main Market",
    consultationType: "In-Person Consultation",
    fee: 8000,
    status: "pending",
  },
  {
    id: 3,
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Gynecologist",
      avatar: "S",
    },
    date: "7/24/2025",
    time: "2:00 PM",
    location: "Onitsha Main Market",
    consultationType: "In-Person Consultation",
    fee: 8000,
    status: "accepted",
  },
  {
    id: 4,
    doctor: {
      name: "Nurse Mary Okafor",
      specialty: "General Care",
      avatar: "M",
    },
    date: "7/21/2025",
    time: "10:00 AM",
    location: "Home Visit",
    consultationType: "Home Visit",
    fee: 12000,
    status: "completed",
  },
];

// PatientAppointmentHistoryCard Component


// PatientAppointmentHistory Parent Component
const PatientAppointmentHistory = () => {
  const appointments = sampleAppointments;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Appointments");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor.specialty
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All Appointments" ||
      appointment.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    "All Appointments",
    "Pending",
    "Accepted",
    "Completed",
    "Rejected",
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Appointment History
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none cursor-pointer min-w-48"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <HistoryNavigation />
      </div>

      {/* Appointments Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAppointments.length} of {appointments.length}{" "}
          appointments
        </p>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <PatientAppointmentHistoryCard
              key={appointment.id}
              appointment={appointment}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "All Appointments"
                ? "Try adjusting your search or filter criteria"
                : "You haven't scheduled any appointments yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentHistory;
