import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import { useBedSide } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import BedsideBookingDetailsModal from "../../components/BedSideModal";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  X,
  User,
  CheckCircle,
} from "lucide-react";
import { type BedsideBooking } from "../../types/bookingdata";
import { toast } from "react-toastify";
import api from "../../constant/api";

interface NearbyWorker {
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

const BedSideBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedBooking, setSelectedBooking] =
    React.useState<BedsideBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [nearbyWorkers, setNearbyWorkers] = React.useState<NearbyWorker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = React.useState(false);
  const [selectedWorker, setSelectedWorker] =
    React.useState<NearbyWorker | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const { data, isLoading, error, refetch } = useBedSide();
  const bookings: BedsideBooking[] = data?.results || [];

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

  const fetchNearbyWorkers = async (booking: BedsideBooking) => {
    setLoadingWorkers(true);
    try {
      const location = parseLocation(booking.user_location || null || "");

      if (!location) {
        toast.error("Unable to parse location from booking");
        return;
      }

      const response = await api.get("inpatient-caregiver/nearby-workers/", {
        params: {
          longitude: location.longitude,
          latitude: location.latitude,
        },
      });

      setNearbyWorkers(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error fetching nearby workers:", err);
      toast.error("Failed to fetch nearby workers");
    } finally {
      setLoadingWorkers(false);
    }
  };

  const filteredAppointments = React.useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hospital_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.chw_info.full_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleViewDetails = (booking: BedsideBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleAssign = async (booking: BedsideBooking) => {
    setSelectedBooking(booking);
    setIsAssignModalOpen(true);
    await fetchNearbyWorkers(booking);
  };

  const handleWorkerSelect = (worker: NearbyWorker) => {
    setSelectedWorker(worker);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedWorker || !selectedBooking) return;

    setActionLoading(selectedBooking.id);
    try {
      await api.post(
        `inpatient-caregiver/bookings/${selectedBooking.id}/assign/`,
        {
          caregiver_id: selectedWorker.user || selectedWorker.user_id,
        }
      );

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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toLocaleString()}`;
  };

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
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
          Bedside Care Bookings
        </h1>
        <p className="text-gray-500 mt-1">
          Track all bedside care bookings ({filteredAppointments.length} booking
          {filteredAppointments.length !== 1 ? "s" : ""})
        </p>
      </div>

      <div className="border border-gray-100 shadow-sm p-2 mb-10 rounded-lg bg-white">
        <Filter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Table Container with Horizontal Scroll */}
        <div className="py-3 overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No bookings found matching your criteria.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Patient Info
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Hospital
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Admission Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Discharge Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        Total Cost
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
                    {filteredAppointments.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {booking.patient_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              CHW: {booking.chw_info.full_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {booking.hospital_name}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-600 max-w-xs">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{booking.hospital_address}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Ward: {booking.room_ward}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{formatDate(booking.admission_date)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {formatDate(booking.expected_discharge)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {booking.number_of_days} day
                              {booking.number_of_days !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatPrice(booking.total_cost)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            {(booking.status as string) === "rejected" && (
                              <button
                                onClick={() => handleAssign(booking)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                              >
                                Assign
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
        </div>

        {/* Mobile Hint */}
        {filteredAppointments.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 text-center sm:hidden">
            Scroll horizontally to see all columns →
          </div>
        )}
      </div>

      {/* Details Modal */}
      <BedsideBookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
      />

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
                            {worker.rating !== undefined && (
                              <span>Rating: {worker.rating.toFixed(1)} ⭐</span>
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
                  setNearbyWorkers([]);
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
      {isConfirmModalOpen && selectedWorker && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Assignment
              </h2>
              <p className="text-gray-600 mb-6">
                Assign{" "}
                <span className="font-semibold">
                  {selectedWorker.full_name}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {selectedBooking.patient_name}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setSelectedWorker(null);
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

export default BedSideBooking;
