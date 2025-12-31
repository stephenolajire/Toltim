import { Calendar, CheckCircle, Clock, Eye, Plus } from "lucide-react";
import React, { useState } from "react";
import StatsDetailModal from "./StatsDetailModal";

interface BookingStats {
  procedures: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    completed: number;
    total: number;
  };
  caregiving: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    completed: number;
    total: number;
  };
  in_patient: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    completed: number;
    total: number;
  };
  overall_total: number;
  top_performing_states: any[];
  top_performing_nurses: any[];
}

interface OverviewStatCardProps {
  stats?: BookingStats;
}

const OverviewStatCard: React.FC<OverviewStatCardProps> = ({ stats }) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const totalPending =
    (stats?.procedures.pending || 0) +
    (stats?.caregiving.pending || 0) +
    (stats?.in_patient.pending || 0);
  const totalApproved =
    (stats?.procedures.approved || 0) +
    (stats?.caregiving.approved || 0) +
    (stats?.in_patient.approved || 0);
  const totalCompleted =
    (stats?.procedures.completed || 0) +
    (stats?.caregiving.completed || 0) +
    (stats?.in_patient.completed || 0);
  const overallTotal = stats?.overall_total || 0;

  // Combine stats for modal display
  const allStats = {
    pending: totalPending,
    approved: totalApproved,
    rejected:
      (stats?.procedures.rejected || 0) +
      (stats?.caregiving.rejected || 0) +
      (stats?.in_patient.rejected || 0),
    cancelled:
      (stats?.procedures.cancelled || 0) +
      (stats?.caregiving.cancelled || 0) +
      (stats?.in_patient.cancelled || 0),
    completed: totalCompleted,
    total: overallTotal,
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-black">Total Bookings</p>
            <span className="text-green-500">
              <Plus size={16} />
            </span>
          </div>
          <div>
            <h1 className="text-blue-500 font-bold text-2xl py-1">
              {overallTotal}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">All services</p>
            <button
              onClick={() => setSelectedModal("total")}
              className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center hover:bg-gray-50 transition-colors"
            >
              <span>
                <Eye size={16} />
              </span>
              <span> View More</span>
            </button>
          </div>
        </div>

        <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-black">Approved</p>
            <span className="text-green-500">
              <Calendar size={16} />
            </span>
          </div>
          <div>
            <h1 className="text-green-500 font-bold text-2xl py-1">
              {totalApproved}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">Ready to proceed</p>
            <button
              onClick={() => setSelectedModal("approved")}
              className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center hover:bg-gray-50 transition-colors"
            >
              <span>
                <Eye size={16} />
              </span>
              <span> View More</span>
            </button>
          </div>
        </div>

        <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-black">Pending</p>
            <span className="text-green-500">
              <Clock size={16} />
            </span>
          </div>
          <div>
            <h1 className="text-yellow-500 font-bold text-2xl py-1">
              {totalPending}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">Awaiting action</p>
            <button
              onClick={() => setSelectedModal("pending")}
              className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center hover:bg-gray-50 transition-colors"
            >
              <span>
                <Eye size={16} />
              </span>
              <span> View More</span>
            </button>
          </div>
        </div>

        <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-black">Completed</p>
            <span className="text-green-500">
              <CheckCircle size={16} />
            </span>
          </div>
          <div>
            <h1 className="text-green-500 font-bold text-2xl py-1">
              {totalCompleted}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-500">Successfully completed</p>
            <button
              onClick={() => setSelectedModal("completed")}
              className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center hover:bg-gray-50 transition-colors"
            >
              <span>
                <Eye size={16} />
              </span>
              <span> View More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals for each stat card */}
      <StatsDetailModal
        isOpen={selectedModal === "total"}
        onClose={() => setSelectedModal(null)}
        title="Total Bookings"
        data={allStats}
      />
      <StatsDetailModal
        isOpen={selectedModal === "approved"}
        onClose={() => setSelectedModal(null)}
        title="Approved Bookings"
        data={allStats}
      />
      <StatsDetailModal
        isOpen={selectedModal === "pending"}
        onClose={() => setSelectedModal(null)}
        title="Pending Bookings"
        data={allStats}
      />
      <StatsDetailModal
        isOpen={selectedModal === "completed"}
        onClose={() => setSelectedModal(null)}
        title="Completed Bookings"
        data={allStats}
      />
    </>
  );
};

export default OverviewStatCard;
