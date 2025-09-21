import React from "react";
import { useQuery } from "@tanstack/react-query";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import AppointmentCard from "../components/booking/AppointmentCard";
import BookingDetailsModal from "../components/booking/BookingDetailsModal";
import api from "../../constant/api";

interface Procedure {
  id: number;
  procedure_id: string;
  title: string;
  description: string;
  duration: string;
  repeated_visits: boolean;
  price: string;
  icon_url: string;
  status: string;
  inclusions?: Array<{ id: number; item: string }>;
  requirements?: Array<{ id: number; item: string }>;
  created_at?: string;
  updated_at?: string;
}

interface ProcedureItem {
  procedure: Procedure;
  procedure_id: number;
  num_days: number;
  subtotal: string;
}

interface PatientDetail {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  relationship_to_patient: string;
}

interface Booking {
  id: number;
  booking_id: string;
  user: string;
  nurse: string;
  nurse_full_name?: string;
  scheduling_option: string;
  start_date: string;
  time_of_day: string;
  selected_days: string[];
  service_dates: string;
  is_for_self: boolean;
  status: "pending" | "assigned" | "active" | "completed";
  total_amount: string;
  procedure_item: ProcedureItem;
  patient_detail: PatientDetail;
  service_address: string;
  service_location: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

const NurseBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedBookingId, setSelectedBookingId] = React.useState<
    number | null
  >(null);

  // Fetch data with react-query (cache: 10 mins)
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["nurse-procedure-bookings"],
    queryFn: async () => {
      const res = await api.get("services/nurse-procedure-bookings/");
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const bookings = data?.results || [];

  const filteredAppointments = React.useMemo(() => {
    return bookings.filter((appointment) => {
      const patientName = `${appointment.patient_detail?.first_name} ${appointment.patient_detail?.last_name}`;

      const matchesSearch =
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.booking_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (appointment.nurse_full_name &&
          appointment.nurse_full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !statusFilter || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleAssignNurse = (appointmentId: number) => {
    console.log(`Assign nurse to appointment ${appointmentId}`);
  };

  const handleViewDetails = (appointmentId: number) => {
    setSelectedBookingId(appointmentId);
  };

  const handleCloseModal = () => {
    setSelectedBookingId(null);
  };

  return (
    <div className="w-full mx-auto">
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
          Nursing Procedures
        </h1>
        <p className="text-gray-500 mt-1">
          Track all nursing procedure bookings for today (
          {filteredAppointments.length} appointments)
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
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading appointments...
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load appointments.
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found matching your criteria.
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={{
                  id: appointment.booking_id,
                  patientId: appointment.booking_id,
                  patientName: `${appointment.patient_detail?.first_name} ${appointment.patient_detail?.last_name}`,
                  appointmentType: appointment.procedure_item.procedure.title,
                  time: new Date(appointment.time_of_day).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  ),
                  location: appointment.service_location,
                  status: appointment.status,
                  assignedNurse: appointment.nurse_full_name,
                }}
                onAssignNurse={() => handleAssignNurse(appointment.id)}
                onViewDetails={() => handleViewDetails(appointment.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBookingId && (
        <BookingDetailsModal
          bookingId={selectedBookingId}
          isOpen={true}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default NurseBooking;
