import { useState } from "react";
import {
  Search,
  Calendar,
  Filter,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import PatientAppointmentHistoryCard from "./AppointmentHistoryCard";
import { useHistory } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import Error from "../components/Error";

const PatientAppointmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Appointments");

  const { data: AppointmentDataHistory, isLoading, error } = useHistory();
  console.log("AppointmentHistory:", AppointmentDataHistory);

  // Transform API data to match the component's expected format
  const transformedAppointments =
    AppointmentDataHistory?.results?.map((item: any) => {
      const bookingDetails = item?.booking_details || {};
      const performedBy = item?.performed_by || {};

      // Extract common fields
      const status =
        bookingDetails?.status || item?.metadata?.status || "pending";
      const startDate = bookingDetails?.start_date || "";

      // Determine doctor/provider info based on booking type
      let providerName = "";
      let specialty = "";
      let avatar = "";

      if (
        item?.booking_type === "CaregiverBooking" ||
        item?.booking_type === "InPatientCaregiverBooking"
      ) {
        providerName =
          bookingDetails?.caregiver_name ||
          bookingDetails?.patient_name ||
          "Caregiver";
        specialty = "Caregiver Services";
        avatar = providerName?.charAt(0)?.toUpperCase() || "C";
      } else if (item?.booking_type === "NurseProcedureBooking") {
        providerName = bookingDetails?.nurse || "Nurse";
        specialty = "Nursing Procedure";
        avatar = providerName?.charAt(0)?.toUpperCase() || "N";
      }

      return {
        id: item?.id || "",
        doctor: {
          name: providerName,
          specialty: specialty,
          avatar: avatar,
        },
        date: startDate ? new Date(startDate).toLocaleDateString() : "N/A",
        time: bookingDetails?.start_time || "N/A",
        location:
          bookingDetails?.service_address || bookingDetails?.location || "N/A",
        consultationType:
          item?.booking_type?.replace(/([A-Z])/g, " $1").trim() ||
          "Consultation",
        fee: bookingDetails?.fee || bookingDetails?.amount || 0,
        status: status,
        rejectionReason: bookingDetails?.rejection_reason || "",
        bookingType: item?.booking_type || "",
        action: item?.action || "",
        performedBy: performedBy?.full_name || "",
        metadata: item?.metadata || {},
      };
    }) || [];

  const filteredAppointments = transformedAppointments.filter(
    (appointment: any) => {
      const matchesSearch =
        appointment?.doctor?.name
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase() || "") ||
        appointment?.doctor?.specialty
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase() || "") ||
        appointment?.location
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase() || "");

      const matchesFilter =
        filterStatus === "All Appointments" ||
        appointment?.status?.toLowerCase() === filterStatus?.toLowerCase();

      return matchesSearch && matchesFilter;
    }
  );

  const statusOptions = [
    "All Appointments",
    "Pending",
    "Accepted",
    "Completed",
    "Rejected",
  ];

  // Calculate statistics
  const stats = {
    total: transformedAppointments.length,
    pending: transformedAppointments.filter((a: any) => a.status === "pending")
      .length,
    completed: transformedAppointments.filter(
      (a: any) => a.status === "completed"
    ).length,
    upcoming: transformedAppointments.filter(
      (a: any) => a.status === "accepted"
    ).length,
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="w-full min-h-screen py-6">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Appointment History
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track and manage all your healthcare appointments
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                Total
              </span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.total}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                Pending
              </span>
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                Upcoming
              </span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.upcoming}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-600">
                Completed
              </span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 mb-6 shadow-md border-2 border-blue-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Search by provider, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-11 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none cursor-pointer min-w-[200px] font-medium text-sm sm:text-base transition-all"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Count */}
      <div className="mb-5">
        <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-100 rounded-lg px-4 py-3">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Showing{" "}
            <span className="font-bold text-blue-600">
              {filteredAppointments?.length || 0}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900">
              {transformedAppointments?.length || 0}
            </span>{" "}
            appointments
          </p>
          {(searchTerm || filterStatus !== "All Appointments") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("All Appointments");
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredAppointments?.length > 0 ? (
          filteredAppointments.map((appointment: any) => (
            <PatientAppointmentHistoryCard
              key={appointment?.id}
              appointment={appointment}
            />
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                {searchTerm || filterStatus !== "All Appointments"
                  ? "Try adjusting your search or filter criteria to find what you're looking for"
                  : "You haven't scheduled any appointments yet. Book your first appointment to get started!"}
              </p>
              {(searchTerm || filterStatus !== "All Appointments") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All Appointments");
                  }}
                  className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentHistory;
