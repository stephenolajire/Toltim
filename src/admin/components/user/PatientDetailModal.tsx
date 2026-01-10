import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../constant/api";
import {
  X,
  User,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Heart,
  Users,
} from "lucide-react";

// API fetch function
const fetchPatientDetails = async (userId: string) => {
  const response = await api.get(`/admin/patient/${userId}/`);
  return response.data;
};

// Modal Component
interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  patientName: string;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
  patientName,
}) => {
//   const [activeTab, setActiveTab] = useState("recent");

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["patientDetails", userId],
    queryFn: () => fetchPatientDetails(userId),
    enabled: isOpen && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {data?.profile_picture ? (
                    <img
                      src={data.profile_picture}
                      alt={patientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {data?.full_name || patientName}
                  </h2>
                  <p className="text-purple-100 text-sm">Patient Profile</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading patient details...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Error Loading Data
                </div>
                <p className="text-gray-600">
                  {error instanceof Error
                    ? error.message
                    : "Unable to fetch patient details. Please try again."}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Patient Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-700 font-medium text-sm">
                        Phone Number
                      </span>
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-blue-900">
                      {data?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 font-medium text-sm">
                        Address
                      </span>
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-base font-semibold text-green-900">
                      {data?.address || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-700 font-medium text-sm">
                        Wallet Balance
                      </span>
                      <Wallet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">
                      ₦{parseFloat(data?.balance || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-700 font-medium text-sm">
                        Total Spent
                      </span>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      ₦{parseFloat(data?.total_spent || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Booking Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<CheckCircle className="w-5 h-5" />}
                    label="Completed"
                    count={data?.total_completed || 0}
                    color="green"
                  />
                  <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Ongoing"
                    count={data?.total_ongoing || 0}
                    color="yellow"
                  />
                  <StatCard
                    icon={<Activity className="w-5 h-5" />}
                    label="Nursing Proc."
                    count={data?.nursing_procedure_count || 0}
                    color="blue"
                  />
                  <StatCard
                    icon={<Heart className="w-5 h-5" />}
                    label="Caregiver"
                    count={data?.caregiver_booking_count || 0}
                    color="pink"
                  />
                </div>

                {/* Inpatient Booking Count (if available) */}
                {data?.inpatient_booking_count && (
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-indigo-700 font-medium text-sm">
                          Inpatient Bookings
                        </span>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">
                          {data.inpatient_booking_count}
                        </p>
                      </div>
                      <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                  </div>
                )}

                {/* Recent Bookings Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Bookings ({data?.recent_bookings?.length || 0})
                    </h3>
                  </div>

                  <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                    <BookingsTable bookings={data?.recent_bookings} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, count, color }: any) => {
  const colorClasses = {
    green:
      "from-green-50 to-green-100 border-green-200 text-green-700 text-green-900",
    yellow:
      "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 text-yellow-900",
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 text-blue-900",
    pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-700 text-pink-900",
  };

  const [bgClass, borderClass, iconColor, textColor] =
    colorClasses[color as keyof typeof colorClasses].split(" ");

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} p-4 rounded-xl border ${borderClass}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${iconColor} mb-2`}>{icon}</div>
        <p className={`${iconColor} text-xs font-medium mb-1`}>{label}</p>
        <p className={`text-xl font-bold ${textColor}`}>{count}</p>
      </div>
    </div>
  );
};

// Bookings Table
const BookingsTable = ({ bookings }: any) => {
  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-500 text-center py-8">No bookings found</p>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking: any) => (
        <div
          key={booking.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-900">
                  {booking.booking_code}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {booking.booking_type}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Patient: {booking.patient_name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Start: {new Date(booking.start_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                ₦{booking.amount}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  booking.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "ongoing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientDetailModal;
