import React from "react";
import BookingNavigation from "../components/booking/BookingNavigation";
import Filter from "../components/booking/Filter";
import { useBedSide } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";
import BedsideBookingDetailsModal from "../../components/BedSideModal";
import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";
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

      <div className="border border-gray-100 shadow-sm p-2 mb-10 rounded-lg">
        <Filter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No bookings found matching your criteria.
            </div>
          ) : (
            filteredAppointments.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {booking.patient_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.hospital_name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-600">
                        {booking.hospital_address}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Ward: {booking.room_ward}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600">
                      {formatDate(booking.admission_date)} -{" "}
                      {formatDate(booking.expected_discharge)}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600">
                      {booking.number_of_days} day
                      {booking.number_of_days !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Services */}
                  {/* <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Services ({booking.items.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {booking.items.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md capitalize"
                        >
                          {item.service}
                        </span>
                      ))}
                      {booking.items.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{booking.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div> */}

                  {/* Assigned CHW */}
                  {/* <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {booking.chw_info.profile_picture ? (
                          <img
                            src={booking.chw_info.profile_picture}
                            alt={booking.chw_info.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Assigned CHW</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {booking.chw_info.full_name}
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Total Cost</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(booking.total_cost)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
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
