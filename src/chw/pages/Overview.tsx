import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp, Users, XCircle, Calendar } from "lucide-react";

import { useWorkerStats } from "../../constant/GlobalContext";

const OverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, isError } = useWorkerStats("chw");

  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load dashboard stats.
      </div>
    );
  }

  // API DATA
  const approved = data.approved;
  const pending = data.pending;
  const cancelled = data.cancelled;
  const rejected = data.rejected;
  const total = data.total_bookings;

  // Chart Data
  const statusChartData = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Cancelled", value: cancelled },
    { name: "Rejected", value: rejected },
  ];

  interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    color: string;
  }
  // Card component
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color,
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend === "up"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Overview Dashboard
            </h1>
            <p className="text-gray-600">
              Worker: {data.worker_name} ({data.worker_role})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={total}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Approved"
            value={approved}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <StatCard
            title="Pending"
            value={pending}
            icon={Calendar}
            color="bg-yellow-500"
          />
          <StatCard
            title="Rejected / Cancelled"
            value={rejected + cancelled}
            icon={XCircle}
            color="bg-red-500"
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Status Breakdown
            </h2>
            <p className="text-sm text-gray-600">
              Distribution of booking decisions
            </p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                name="Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
