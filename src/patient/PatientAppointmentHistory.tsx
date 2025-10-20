import { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import HistoryNavigation from "./HistoryNav";
import PatientAppointmentHistoryCard from "./AppointmentHistoryCard";
import { useHistory } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import Error from "../components/Error";

const PatientAppointmentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Appointments");

  const { data: AppointmentDataHistory, isLoading, error } = useHistory();
  console.log(AppointmentDataHistory);

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

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
          Showing {filteredAppointments?.length || 0} of{" "}
          {transformedAppointments?.length || 0} appointments
        </p>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {filteredAppointments?.length > 0 ? (
          filteredAppointments.map((appointment: any) => (
            <PatientAppointmentHistoryCard
              key={appointment?.id}
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
