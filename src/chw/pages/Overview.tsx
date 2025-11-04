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
  // LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  XCircle,
  DollarSign,
  Calendar,
} from "lucide-react";

const OverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - Replace with actual API data
  const monthlyData = [
    {
      month: "Jan",
      acceptedCaregiving: 45,
      acceptedInPatient: 32,
      rejected: 12,
      revenue: 2500000,
    },
    {
      month: "Feb",
      acceptedCaregiving: 52,
      acceptedInPatient: 38,
      rejected: 15,
      revenue: 2800000,
    },
    {
      month: "Mar",
      acceptedCaregiving: 48,
      acceptedInPatient: 42,
      rejected: 10,
      revenue: 3100000,
    },
    {
      month: "Apr",
      acceptedCaregiving: 60,
      acceptedInPatient: 45,
      rejected: 18,
      revenue: 3400000,
    },
    {
      month: "May",
      acceptedCaregiving: 65,
      acceptedInPatient: 50,
      rejected: 14,
      revenue: 3800000,
    },
    {
      month: "Jun",
      acceptedCaregiving: 70,
      acceptedInPatient: 55,
      rejected: 16,
      revenue: 4200000,
    },
    {
      month: "Jul",
      acceptedCaregiving: 68,
      acceptedInPatient: 52,
      rejected: 20,
      revenue: 4000000,
    },
    {
      month: "Aug",
      acceptedCaregiving: 75,
      acceptedInPatient: 58,
      rejected: 13,
      revenue: 4500000,
    },
    {
      month: "Sep",
      acceptedCaregiving: 72,
      acceptedInPatient: 60,
      rejected: 11,
      revenue: 4600000,
    },
    {
      month: "Oct",
      acceptedCaregiving: 80,
      acceptedInPatient: 65,
      rejected: 17,
      revenue: 5000000,
    },
    {
      month: "Nov",
      acceptedCaregiving: 78,
      acceptedInPatient: 62,
      rejected: 19,
      revenue: 4800000,
    },
    {
      month: "Dec",
      acceptedCaregiving: 85,
      acceptedInPatient: 70,
      rejected: 15,
      revenue: 5500000,
    },
  ];

  // Calculate totals
  const totalAcceptedCaregiving = monthlyData.reduce(
    (sum, item) => sum + item.acceptedCaregiving,
    0
  );
  const totalAcceptedInPatient = monthlyData.reduce(
    (sum, item) => sum + item.acceptedInPatient,
    0
  );
  const totalRejected = monthlyData.reduce(
    (sum, item) => sum + item.rejected,
    0
  );
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalAccepted = totalAcceptedCaregiving + totalAcceptedInPatient;

  // Calculate percentages and trends
  const acceptanceRate = (
    (totalAccepted / (totalAccepted + totalRejected)) *
    100
  ).toFixed(1);
  const avgMonthlyRevenue = (totalRevenue / monthlyData.length).toFixed(0);

  const formatCurrency = (value:any) => {
    return `₦${(value / 1000000).toFixed(1)}M`;
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
    color: string;
  }

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
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
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
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Overview Dashboard
              </h1>
              <p className="text-gray-600">
                Track your booking performance and revenue
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Accepted Caregiving"
            value={totalAcceptedCaregiving.toLocaleString()}
            subtitle="Total bookings"
            icon={Users}
            color="bg-blue-500"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Accepted In-Patient"
            value={totalAcceptedInPatient.toLocaleString()}
            subtitle="Total bookings"
            icon={Users}
            color="bg-purple-500"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Rejected Requests"
            value={totalRejected.toLocaleString()}
            subtitle={`${acceptanceRate}% acceptance rate`}
            icon={XCircle}
            color="bg-red-500"
            trend="down"
            trendValue="-5%"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle={`Avg ${formatCurrency(avgMonthlyRevenue)}/month`}
            icon={DollarSign}
            color="bg-green-500"
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bookings Bar Chart */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Bookings Overview
              </h2>
              <p className="text-sm text-gray-600">
                Monthly accepted and rejected bookings
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="acceptedCaregiving"
                  fill="#3b82f6"
                  name="Caregiving"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="acceptedInPatient"
                  fill="#8b5cf6"
                  name="In-Patient"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rejected"
                  fill="#ef4444"
                  name="Rejected"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Revenue Line Chart */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h2>
              <p className="text-sm text-gray-600">
                Monthly revenue generated (₦)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [
                    `₦${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
        </div>

        {/* Combined Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Performance Breakdown
            </h2>
            <p className="text-sm text-gray-600">
              Detailed view of all metrics across the year
            </p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                yAxisId="left"
                dataKey="acceptedCaregiving"
                fill="#3b82f6"
                name="Caregiving"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="acceptedInPatient"
                fill="#8b5cf6"
                name="In-Patient"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="rejected"
                fill="#ef4444"
                name="Rejected"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                name="Revenue (₦)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Data Table */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Statistics
            </h2>
            <p className="text-sm text-gray-600">Detailed breakdown by month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Caregiving
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    In-Patient
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Rejected
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-blue-600 font-medium">
                      {item.acceptedCaregiving}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-purple-600 font-medium">
                      {item.acceptedInPatient}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                      {item.rejected}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                      {item.acceptedCaregiving +
                        item.acceptedInPatient +
                        item.rejected}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">
                      ₦{item.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                  <td className="py-3 px-4 text-sm text-right text-blue-700">
                    {totalAcceptedCaregiving}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-purple-700">
                    {totalAcceptedInPatient}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-700">
                    {totalRejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    {totalAccepted + totalRejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-700">
                    ₦{totalRevenue.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OverviewDashboard;
