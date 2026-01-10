import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../constant/api";
import {
  X,
  User,
  Wallet,
  Lock,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileText,
} from "lucide-react";

// API fetch function with proper error handling
const fetchWorkerDetails = async (userId: string) => {
  const response = await api.get(`/admin/workers/${userId}/`);
  return response.data;
};

// Modal Component
interface WorkerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  workerName: string;
  role: string;
}

const WorkerDetailModal: React.FC<WorkerDetailModalProps> = ({
  isOpen,
  onClose,
  userId,
  workerName,
  role,
}) => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["workerDetails", userId],
    queryFn: () => fetchWorkerDetails(userId),
    enabled: isOpen && !!userId,
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  console.log(userId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {workerName}
                  </h2>
                  <p className="text-blue-100 text-sm capitalize">
                    {role} Profile
                  </p>
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

          {/* Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading worker details...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <div className="text-red-500 text-lg font-semibold mb-2">
                  Error Loading Data
                </div>
                <p className="text-gray-600">
                  {error instanceof Error
                    ? error.message
                    : "Unable to fetch worker details. Please try again."}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Wallet Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-700 font-medium text-sm">
                        Available Balance
                      </span>
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {data?.wallet?.currency}{" "}
                      {parseFloat(data?.wallet?.balance || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-700 font-medium text-sm">
                        Locked Balance
                      </span>
                      <Lock className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">
                      {data?.wallet?.currency}{" "}
                      {parseFloat(
                        data?.wallet?.locked_balance || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-700 font-medium text-sm">
                        Avg Rating
                      </span>
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {data?.reviews?.length > 0
                        ? (
                            data.reviews.reduce(
                              (acc: number, r: any) => acc + r.rating,
                              0
                            ) / data.reviews.length
                          ).toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Bookings Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    icon={<CheckCircle className="w-5 h-5" />}
                    label="Completed"
                    count={data?.completed_bookings?.length || 0}
                    color="blue"
                  />
                  <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Ongoing"
                    count={data?.ongoing_bookings?.length || 0}
                    color="yellow"
                  />
                  <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Accepted"
                    count={data?.accepted_bookings?.length || 0}
                    color="indigo"
                  />
                </div>

                {/* Tabs Section */}
                <TabsSection data={data} />
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
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 text-blue-900",
    yellow:
      "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 text-yellow-900",
    indigo:
      "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 text-indigo-900",
  };

  const [bgClass, borderClass, iconColor, textColor] =
    colorClasses[color as keyof typeof colorClasses].split(" ");

  return (
    <div
      className={`bg-gradient-to-br ${bgClass} p-4 rounded-xl border ${borderClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${iconColor} text-sm font-medium mb-1`}>{label}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
        </div>
        <div className={`${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
};

// Tabs Section Component
const TabsSection = ({ data }: any) => {
  const [activeTab, setActiveTab] = useState("completed");

  const tabs = [
    {
      id: "completed",
      label: "Completed Bookings",
      count: data?.completed_bookings?.length || 0,
    },
    {
      id: "ongoing",
      label: "Ongoing Bookings",
      count: data?.ongoing_bookings?.length || 0,
    },
    {
      id: "accepted",
      label: "Accepted Bookings",
      count: data?.accepted_bookings?.length || 0,
    },
    {
      id: "transactions",
      label: "Transactions",
      count: data?.transactions?.length || 0,
    },
    { id: "reviews", label: "Reviews", count: data?.reviews?.length || 0 },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      {/* Tab Headers */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
        {activeTab === "completed" && (
          <BookingsTable bookings={data?.completed_bookings} />
        )}
        {activeTab === "ongoing" && (
          <BookingsTable bookings={data?.ongoing_bookings} />
        )}
        {activeTab === "accepted" && (
          <BookingsTable bookings={data?.accepted_bookings} />
        )}
        {activeTab === "transactions" && (
          <TransactionsTable transactions={data?.transactions} />
        )}
        {activeTab === "reviews" && <ReviewsList reviews={data?.reviews} />}
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
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
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
                {booking.amount}
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

// Transactions Table
const TransactionsTable = ({ transactions }: any) => {
  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No transactions found</p>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction: any) => (
        <div
          key={transaction.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.transaction_type === "credit"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <DollarSign
                  className={`w-5 h-5 ${
                    transaction.transaction_type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">{transaction.reference}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-bold ${
                  transaction.transaction_type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.transaction_type === "credit" ? "+" : "-"}
                {transaction.amount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Reviews List
const ReviewsList = ({ reviews }: any) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500 text-center py-8">No reviews found</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">
                {review.reviewer_name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkerDetailModal;
