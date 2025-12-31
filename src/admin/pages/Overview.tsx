import React from "react";
import { useQuery } from "@tanstack/react-query";
import OverviewStatCard from "../components/overview/OverviewStatCard";
import OverviewChart from "../components/overview/OverViewChart";
import TopPerformingNurses from "../components/overview/OverviewNurses";
import api from "../../constant/api";

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
  top_performing_states: Array<{
    state: string;
    bookings: number;
    workers: number;
    penetration: number;
    breakdown: {
      nurses: number;
      chws: number;
    };
  }>;
  top_performing_nurses: Array<{
    name: string;
    specialty: string;
    rating: number;
    bookings: number;
    image: string | null;
  }>;
}

const Overview: React.FC = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<BookingStats>({
    queryKey: ["bookingStats"],
    queryFn: async () => {
      const response = await api.get("/history/booking-stats/");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading overview data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading overview data</div>
      </div>
    );
  }

  return (
    <div>
      <div className="py-5">
        <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor your healthcare operations at a glance
        </p>
      </div>

      <div>
        <OverviewStatCard stats={stats} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-10">
        <OverviewChart states={stats?.top_performing_states || []} />
        <TopPerformingNurses nurses={stats?.top_performing_nurses || []} />
      </div>
    </div>
  );
};

export default Overview;
