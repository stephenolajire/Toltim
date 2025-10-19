import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import { useBedSide } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import BedsideBookingDetailsModal from "../../components/BedSideModal";
import { Calendar, MapPin, Clock, DollarSign, Eye } from "lucide-react";
import { type BedsideBooking } from "../../types/bookingdata";

const BedSideBooking: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedBooking, setSelectedBooking] =
    React.useState<BedsideBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data, isLoading, error } = useBedSide();
  const bookings: BedsideBooking[] = data?.results || [];

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

  const handleAssign = (booking: BedsideBooking) => {
    console.log("Assigning CHW to booking:", booking.id);
    // Add your assignment logic here
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
    </div>
  );
};

export default BedSideBooking;
