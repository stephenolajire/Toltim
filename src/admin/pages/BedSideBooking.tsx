import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import AppointmentCard from "../components/booking/AppointmentCard";

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

// Sample data
const appointmentsData: Appointment[] = [
  {
    id: "1",
    patientId: "NP001",
    patientName: "John Doe",
    appointmentType: "Blood Pressure Check",
    time: "09:00 AM",
    location: "Lagos",
    status: "pending",
  },
  {
    id: "2",
    patientId: "NP002",
    patientName: "Jane Smith",
    appointmentType: "Wound Dressing",
    time: "10:30 AM",
    location: "Abuja",
    status: "assigned",
    assignedNurse: "nurse.jane@hospital.com",
  },
  {
    id: "3",
    patientId: "NP003",
    patientName: "Michael Johnson",
    appointmentType: "Injection Administration",
    time: "11:15 AM",
    location: "Port Harcourt",
    status: "active",
    assignedNurse: "nurse.mary@hospital.com",
  },
  {
    id: "4",
    patientId: "NP004",
    patientName: "Sarah Wilson",
    appointmentType: "Vital Signs Check",
    time: "02:00 PM",
    location: "Lagos",
    status: "completed",
    assignedNurse: "nurse.john@hospital.com",
  },
  {
    id: "5",
    patientId: "NP005",
    patientName: "David Brown",
    appointmentType: "Blood Pressure Check",
    time: "03:30 PM",
    location: "Kano",
    status: "pending",
  },
  {
    id: "6",
    patientId: "NP006",
    patientName: "Lisa Anderson",
    appointmentType: "Medication Review",
    time: "04:15 PM",
    location: "Abuja",
    status: "assigned",
    assignedNurse: "nurse.sarah@hospital.com",
  },
];

const BedSideBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const filteredAppointments = React.useMemo(() => {
    return appointmentsData.filter((appointment) => {
      const matchesSearch =
        appointment.patientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patientId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (appointment.assignedNurse &&
          appointment.assignedNurse
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !statusFilter || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleAssignNurse = (appointmentId: string) => {
    console.log(`Assign nurse to appointment ${appointmentId}`);
    // Here you would typically open a modal or navigate to assignment page
  };

  const handleViewDetails = (appointmentId: string) => {
    console.log(`View details for appointment ${appointmentId}`);
    // Here you would typically open a modal or navigate to details page
  };

  return (
    <div className="w-full mx-auto ">
      <div className="py-5">
        <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
          Booking Management
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage all healthcare bookings
        </p>
      </div>

      <div className="mb-6">
        <BookingNavigation />
      </div>

      <div className="py-5">
        <h1 className="font-semibold text-black text-2xl capitalize">
          Caregiver Bookings
        </h1>
        <p className="text-gray-500 mt-1">
          Track all caregiver bookings for today ({filteredAppointments.length}{" "}
          appointments)
        </p>
      </div>

      <div className="border border-gray-100 shadow-sm p-2 mb-10 rounded-lg">
        <Filter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="py-3 space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found matching your criteria.
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onAssignNurse={handleAssignNurse}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BedSideBooking;
