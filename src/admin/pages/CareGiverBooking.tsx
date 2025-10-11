import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import AppointmentCard from "../components/booking/AppointmentCard";
import { useCareGiverBooking } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import api from "../../constant/api";

interface CaregiverBooking {
  id: string;
  user: string;
  caregiver_type: string;
  duration: string;
  patient_name: string;
  patient_age: number;
  medical_condition: string;
  care_location: string;
  care_address: string;
  start_date: string;
  total_price: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  special_requirements: string;
  status: "pending" | "assigned" | "active" | "completed" | "cancelled";
  assigned_worker: string | null;
  created_at: string;
  updated_at: string;
}

// interface BookingResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: CaregiverBooking[];
// }

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

const CaregiverBooking: React.FC = () => {
  const {
    data: CareBookings,
    isLoading,
    error,
    refetch,
  } = useCareGiverBooking();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  // Transform backend data to match AppointmentCard interface
  const transformedAppointments: Appointment[] = React.useMemo(() => {
    if (!CareBookings?.results) return [];

    return CareBookings.results.map((booking: CaregiverBooking) => ({
      id: booking.id,
      patientId: booking.user,
      patientName: booking.patient_name,
      appointmentType: booking.caregiver_type,
      time: new Date(booking.start_date).toLocaleString(),
      location: `${booking.care_location} - ${booking.care_address}`,
      status: booking.status,
      assignedNurse: booking.assigned_worker || undefined,
    }));
  }, [CareBookings]);

  const filteredAppointments = React.useMemo(() => {
    return transformedAppointments.filter((appointment) => {
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
  }, [transformedAppointments, searchTerm, statusFilter]);

  const handleAssignNurse = async (appointmentId: string, patientId:string) => {
    try {
      setActionLoading(appointmentId);
      await api.post(`/caregiver-booking/${appointmentId}/assign/`, {
        user_id: patientId,
      });

      // Refetch data to update UI
      if (refetch) {
        await refetch();
      }

      console.log(`Nurse assigned to appointment ${appointmentId}`);
    } catch (err) {
      console.error("Error assigning nurse:", err);
      // You might want to show a toast notification here
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (appointmentId: string, patientId:string) => {
    try {
      setActionLoading(appointmentId);
      await api.post(`/caregiver-booking/${appointmentId}/approve/`, {
        user_id: patientId,
      });

      // Refetch data to update UI
      if (refetch) {
        await refetch();
      }

      console.log(`Appointment ${appointmentId} approved`);
    } catch (err) {
      console.error("Error approving appointment:", err);
      // You might want to show a toast notification here
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setActionLoading(appointmentId);
      await api.post(`/api/caregiver-booking/${appointmentId}/cancel/`, {
        id: appointmentId,
      });

      // Refetch data to update UI
      if (refetch) {
        await refetch();
      }

      console.log(`Appointment ${appointmentId} cancelled`);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      // You might want to show a toast notification here
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (appointmentId: string) => {
    console.log(`View details for appointment ${appointmentId}`);
    // Find the original booking data
    const booking = CareBookings?.results.find(
      (b: CaregiverBooking) => b.id === appointmentId
    );
    console.log("Booking details:", booking);
    // Here you would typically open a modal or navigate to details page
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

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

        <div className="py-3 space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found matching your criteria.
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div>
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onAssignNurse={handleAssignNurse}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  isLoading={actionLoading === appointment.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverBooking;
