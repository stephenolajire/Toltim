// Update the import statement to separate type imports
import type {
  CaregiverBookingData,
  NearbyWorker,
} from "../../types/bookingdata";
import { type CaregiverBookingInfo } from "../../types/carebooking";
import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import { useCareGiverBooking } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import api from "../../constant/api";
import { X, MapPin, User, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import CaregiverBookingTable from "../components/booking/CaregiverBookingTable";
import CaregiverBookingModal from "../../nurse/components/CaregiverBookingModal";

// Rest of your component code stays the same

const CaregiverBooking: React.FC = () => {
  const {
    data: CareBookings,
    isLoading,
    error,
    refetch,
  } = useCareGiverBooking();
  console.log(CareBookings);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] =
    React.useState<CaregiverBookingData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [nearbyWorkers, setNearbyWorkers] = React.useState<NearbyWorker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = React.useState(false);
  const [selectedWorker, setSelectedWorker] =
    React.useState<NearbyWorker | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  // Extract longitude and latitude from care_location string
  const parseLocation = (
    locationString: string
  ): { longitude: number; latitude: number } | null => {
    try {
      // Format: "SRID=4326;POINT (longitude latitude)"
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

  const filteredAppointments = React.useMemo(() => {
    if (!CareBookings?.results) return [];

    return CareBookings.results.filter((booking: CaregiverBookingInfo) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [CareBookings, searchTerm, statusFilter]);

  const fetchNearbyWorkers = async (booking: CaregiverBookingData) => {
    setLoadingWorkers(true);
    try {
      const location = parseLocation(booking.care_location);

      if (!location) {
        toast.error("Unable to parse location from booking");
        return;
      }

      const response = await api.get("inpatient-caregiver/nearby-workers/", {
        params: {
          longitude: location.longitude,
          latitude: location.latitude,
          role: booking.caregiver_type,
        },
      });

      console.log(response.data);

      setNearbyWorkers(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error fetching nearby workers:", err);
      toast.error("Failed to fetch nearby workers");
    } finally {
      setLoadingWorkers(false);
    }
  };

  const handleAssignNurse = async (
    appointmentId: string
    // patientId: string
  ) => {
    const booking = CareBookings?.results.find(
      (b: CaregiverBookingData) => b.id === appointmentId
    );

    if (booking) {
      setSelectedBooking(booking);
      setIsAssignModalOpen(true);
      await fetchNearbyWorkers(booking);
    }
  };

  const handleWorkerSelect = (worker: NearbyWorker) => {
    setSelectedWorker(worker);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedWorker || !selectedBooking) return;

    setActionLoading(selectedBooking.id);
    try {
      await api.post(`caregiver-booking/${selectedBooking.id}/assign/`, {
        caregiver_id: selectedWorker.user || selectedWorker.user_id,
      });

      if (refetch) {
        await refetch();
      }

      toast.success("Worker assigned successfully!");
      setIsConfirmModalOpen(false);
      setIsAssignModalOpen(false);
      setSelectedWorker(null);
      setSelectedBooking(null);
    } catch (err: any) {
      console.error("Error assigning worker:", err);
      toast.error(err.response?.data?.message || "Failed to assign worker");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (appointmentId: string, patientId: string) => {
    try {
      setActionLoading(appointmentId);
      await api.post(`/caregiver-booking/${appointmentId}/approve/`, {
        user_id: patientId,
      });

      if (refetch) {
        await refetch();
      }

      console.log(`Appointment ${appointmentId} approved`);
    } catch (err) {
      console.error("Error approving appointment:", err);
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

      if (refetch) {
        await refetch();
      }

      console.log(`Appointment ${appointmentId} cancelled`);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (appointmentId: string) => {
    const booking = CareBookings?.results.find(
      (b: CaregiverBookingData) => b.id === appointmentId
    );
    if (booking) {
      setSelectedBooking(booking);
      setIsViewModalOpen(true);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

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

        <div className="w-full">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointments found matching your criteria.
            </div>
          ) : (
            <CaregiverBookingTable
              bookings={filteredAppointments}
              onAssignWorker={handleAssignNurse}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onCancel={handleCancel}
              // actionLoading={actionLoading}
            />
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedBooking && (
        <CaregiverBookingModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
        />
      )}

      {/* Assign Worker Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Assign Worker
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select a nearby worker for {selectedBooking?.patient_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedBooking(null);
                  setNearbyWorkers([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingWorkers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : nearbyWorkers.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No nearby workers found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      onClick={() => handleWorkerSelect(worker)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {worker.profile_picture ? (
                            <img
                              src={worker.profile_picture}
                              alt={worker.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {worker.full_name}
                            </h3>
                            {worker.verified_chw && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          {worker.specialization && (
                            <p className="text-sm text-blue-600 mb-1">
                              {worker.specialization}
                            </p>
                          )}
                          {worker.biography && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {worker.biography}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {worker.years_of_experience !== undefined && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium">
                                  {worker.years_of_experience} yrs
                                </span>
                                experience
                              </span>
                            )}
                            {worker.available !== undefined && (
                              <span
                                className={`px-2 py-0.5 rounded-full ${
                                  worker.available
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {worker.available ? "Available" : "Unavailable"}
                              </span>
                            )}
                          </div>
                        </div>
                        {worker.distance !== undefined && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{worker.distance.toFixed(1)} km</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Assignment
              </h3>
              <p className="text-gray-600">
                Are you sure you want to assign{" "}
                <span className="font-semibold">
                  {selectedWorker.full_name}
                </span>{" "}
                to this booking?
              </p>
              {selectedWorker.specialization && (
                <p className="text-sm text-blue-600 mt-2">
                  {selectedWorker.specialization}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSelectedWorker(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={actionLoading === selectedBooking?.id}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {actionLoading === selectedBooking?.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverBooking;
