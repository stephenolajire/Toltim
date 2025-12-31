import React from "react";
import { useQuery } from "@tanstack/react-query";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import AppointmentTable from "../components/booking/AppointmentTable";
import BookingDetailsModal from "../components/booking/BookingDetailsModal";
import api from "../../constant/api";
import { X, User, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

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
  procedure_item?: ProcedureItem;
  patient_detail?: PatientDetail;
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

interface NearbyNurse {
  id: string;
  full_name: string;
  profile_picture?: string;
  verified_chw?: boolean;
  specialization?: string;
  biography?: string;
  years_of_experience?: number;
  rating?: number;
  user?: string;
  user_id?: string;
}

const NurseBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedBookingId, setSelectedBookingId] = React.useState<
    number | null
  >(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const [nearbyNurses, setNearbyNurses] = React.useState<NearbyNurse[]>([]);
  const [loadingNurses, setLoadingNurses] = React.useState(false);
  const [selectedNurse, setSelectedNurse] = React.useState<NearbyNurse | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  // Fetch data with react-query (cache: 10 mins)
  const { data, isLoading, isError, refetch } = useQuery<ApiResponse>({
    queryKey: ["nurse-procedure-bookings"],
    queryFn: async () => {
      const res = await api.get("services/nurse-procedure-bookings/");
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const bookings = data?.results || [];

  const parseLocation = (
    locationString: string
  ): { longitude: number; latitude: number } | null => {
    try {
      const match = locationString.match(/POINT\s*\(([^\s]+)\s+([^\s]+)\)/);
      if (match) {
        return {
          longitude: parseFloat(match[1]),
          latitude: parseFloat(match[2]),
        };
      }
      return null;
    } catch (error) {
      console.error("Error parsing location:", error);
      return null;
    }
  };

  const fetchNearbyNurses = async (booking: Booking) => {
    setLoadingNurses(true);
    try {
      const location = parseLocation(booking.service_location);

      if (!location) {
        toast.error("Unable to parse location from booking");
        return;
      }

      const response = await api.get("chw/nearby-nurses/", {
        params: {
          longitude: location.longitude,
          latitude: location.latitude,
        },
      });

      setNearbyNurses(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error fetching nearby nurses:", err);
      toast.error("Failed to fetch nearby nurses");
    } finally {
      setLoadingNurses(false);
    }
  };

  const filteredAppointments = React.useMemo(() => {
    return bookings.filter((appointment) => {
      // Add null checks for nested properties
      if (
        !appointment.patient_detail ||
        !appointment.procedure_item?.procedure
      ) {
        return false;
      }

      const patientName = `${appointment.patient_detail.first_name} ${appointment.patient_detail.last_name}`;

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

  const appointmentList = React.useMemo(() => {
    return filteredAppointments.map((appointment) => ({
      id: String(appointment.id),
      patientId: appointment.booking_id,
      patientName: `${appointment.patient_detail!.first_name} ${
        appointment.patient_detail!.last_name
      }`,
      appointmentType: appointment.procedure_item!.procedure.title,
      time: new Date(appointment.time_of_day).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: appointment.service_location,
      status: appointment.status,
      assignedNurse: appointment.nurse_full_name,
    }));
  }, [filteredAppointments]);

  const [actionLoading, setActionLoading] = React.useState<
    string | number | null
  >(null);

  const handleAssignNurse = async (appointmentId: string) => {
    const booking = bookings.find(
      (b: Booking) => b.id === Number(appointmentId)
    );

    if (booking) {
      setSelectedBooking(booking);
      setIsAssignModalOpen(true);
      await fetchNearbyNurses(booking);
    }
  };

  const handleNurseSelect = (nurse: NearbyNurse) => {
    setSelectedNurse(nurse);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedNurse || !selectedBooking) return;

    setActionLoading(String(selectedBooking.id));
    try {
      await api.post(
        `services/nurse-procedure-bookings/${selectedBooking.id}/approve/`
      );

      if (refetch) {
        await refetch();
      }

      toast.success("Nurse assigned successfully!");
      setIsConfirmModalOpen(false);
      setIsAssignModalOpen(false);
      setSelectedNurse(null);
      setSelectedBooking(null);
    } catch (err: any) {
      console.error("Error assigning nurse:", err);
      toast.error(err.response?.data?.message || "Failed to assign nurse");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      setActionLoading(appointmentId);
      await api.post(
        `services/nurse-procedure-bookings/${appointmentId}/reject/`,
        { rejection_reason: "cancelled" }
      );

      if (refetch) await refetch();

      console.log(`Appointment ${appointmentId} cancelled`);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    } finally {
      setActionLoading(null);
    }
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
            <AppointmentTable
              onAssignNurse={(id) => handleAssignNurse(id)}
              appointments={appointmentList}
              onViewDetails={(id) => handleViewDetails(Number(id))}
              onCancel={(id) => handleCancel(id)}
              isLoading={Boolean(actionLoading)}
            />
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

      {/* Assign Nurse Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Assign Nurse
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select a nearby nurse for{" "}
                  {selectedBooking?.patient_detail?.first_name}{" "}
                  {selectedBooking?.patient_detail?.last_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedBooking(null);
                  setNearbyNurses([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingNurses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : nearbyNurses.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No nearby nurses found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyNurses.map((nurse) => (
                    <div
                      key={nurse.id}
                      onClick={() => handleNurseSelect(nurse)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {nurse.profile_picture ? (
                            <img
                              src={nurse.profile_picture}
                              alt={nurse.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {nurse.full_name}
                            </h3>
                            {nurse.verified_chw && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          {nurse.specialization && (
                            <p className="text-sm text-blue-600 mb-1">
                              {nurse.specialization}
                            </p>
                          )}
                          {nurse.biography && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {nurse.biography}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {nurse.years_of_experience !== undefined && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">
                                  {nurse.years_of_experience} yrs
                                </span>
                                experience
                              </span>
                            )}
                            {nurse.rating !== undefined && (
                              <span>Rating: {nurse.rating.toFixed(1)} ⭐</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedBooking(null);
                  setNearbyNurses([]);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Assignment Modal */}
      {isConfirmModalOpen && selectedNurse && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Assignment
              </h2>
              <p className="text-gray-600 mb-6">
                Assign{" "}
                <span className="font-semibold">{selectedNurse.full_name}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {selectedBooking.patient_detail?.first_name}{" "}
                  {selectedBooking.patient_detail?.last_name}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedNurse(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  disabled={Boolean(actionLoading)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseBooking;
