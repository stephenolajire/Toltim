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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Heart,
  Syringe,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";

const NurseOverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - Replace with actual API data from nurse bookings
  const bookingSummary = {
    procedures: {
      accepted: 45,
      rejected: 8,
      completed: 38,
      notCompleted: 7,
      totalEarned: 1250000,
    },
    caregiving: {
      accepted: 32,
      rejected: 5,
      completed: 28,
      notCompleted: 4,
      totalEarned: 980000,
    },
  };

  // Monthly earnings data
  const monthlyEarningsData = [
    { month: "Jan", procedures: 95000, caregiving: 70000 },
    { month: "Feb", procedures: 102000, caregiving: 75000 },
    { month: "Mar", procedures: 98000, caregiving: 80000 },
    { month: "Apr", procedures: 110000, caregiving: 82000 },
    { month: "May", procedures: 105000, caregiving: 85000 },
    { month: "Jun", procedures: 115000, caregiving: 88000 },
    { month: "Jul", procedures: 108000, caregiving: 78000 },
    { month: "Aug", procedures: 120000, caregiving: 90000 },
    { month: "Sep", procedures: 112000, caregiving: 85000 },
    { month: "Oct", periods: 125000, caregiving: 92000 },
    { month: "Nov", procedures: 118000, caregiving: 87000 },
    { month: "Dec", procedures: 122000, caregiving: 88000 },
  ];

  // Acceptance rate data
  const acceptanceRateData = [
    { month: "Jan", procedures: 82, caregiving: 85 },
    { month: "Feb", procedures: 85, caregiving: 87 },
    { month: "Mar", procedures: 83, caregiving: 86 },
    { month: "Apr", procedures: 86, caregiving: 88 },
    { month: "May", procedures: 88, caregiving: 90 },
    { month: "Jun", procedures: 87, caregiving: 89 },
    { month: "Jul", procedures: 89, caregiving: 91 },
    { month: "Aug", procedures: 90, caregiving: 92 },
    { month: "Sep", procedures: 88, caregiving: 90 },
    { month: "Oct", procedures: 91, caregiving: 93 },
    { month: "Nov", procedures: 89, caregiving: 91 },
    { month: "Dec", procedures: 92, caregiving: 94 },
  ];

  // Monthly booking counts
  const monthlyBookingsData = [
    {
      month: "Jan",
      proceduresAccepted: 3,
      proceduresRejected: 1,
      caregivingAccepted: 2,
      caregivingRejected: 0,
    },
    {
      month: "Feb",
      proceduresAccepted: 4,
      proceduresRejected: 1,
      caregivingAccepted: 3,
      caregivingRejected: 1,
    },
    {
      month: "Mar",
      proceduresAccepted: 3,
      proceduresRejected: 0,
      caregivingAccepted: 2,
      caregivingRejected: 0,
    },
    {
      month: "Apr",
      proceduresAccepted: 5,
      proceduresRejected: 1,
      caregivingAccepted: 3,
      caregivingRejected: 0,
    },
    {
      month: "May",
      proceduresAccepted: 4,
      proceduresRejected: 0,
      caregivingAccepted: 2,
      caregivingRejected: 1,
    },
    {
      month: "Jun",
      proceduresAccepted: 5,
      proceduresRejected: 1,
      caregivingAccepted: 4,
      caregivingRejected: 0,
    },
    {
      month: "Jul",
      proceduresAccepted: 3,
      proceduresRejected: 1,
      caregivingAccepted: 2,
      caregivingRejected: 1,
    },
    {
      month: "Aug",
      proceduresAccepted: 4,
      proceduresRejected: 0,
      caregivingAccepted: 3,
      caregivingRejected: 0,
    },
    {
      month: "Sep",
      proceduresAccepted: 3,
      proceduresRejected: 1,
      caregivingAccepted: 2,
      caregivingRejected: 0,
    },
    {
      month: "Oct",
      proceduresAccepted: 5,
      proceduresRejected: 0,
      caregivingAccepted: 4,
      caregivingRejected: 1,
    },
    {
      month: "Nov",
      proceduresAccepted: 3,
      proceduresRejected: 1,
      caregivingAccepted: 2,
      caregivingRejected: 1,
    },
    {
      month: "Dec",
      proceduresAccepted: 3,
      proceduresRejected: 0,
      caregivingAccepted: 3,
      caregivingRejected: 0,
    },
  ];

  // Completion status for pie chart
  const completionStatusData = [
    {
      name: "Completed",
      value:
        bookingSummary.procedures.completed +
        bookingSummary.caregiving.completed,
      color: "#10b981",
    },
    {
      name: "Not Completed",
      value:
        bookingSummary.procedures.notCompleted +
        bookingSummary.caregiving.notCompleted,
      color: "#f59e0b",
    },
    {
      name: "Rejected",
      value:
        bookingSummary.procedures.rejected + bookingSummary.caregiving.rejected,
      color: "#ef4444",
    },
  ];

  // Calculate totals
  const totalAccepted =
    bookingSummary.procedures.accepted + bookingSummary.caregiving.accepted;
  const totalRejected =
    bookingSummary.procedures.rejected + bookingSummary.caregiving.rejected;
  const totalCompleted =
    bookingSummary.procedures.completed + bookingSummary.caregiving.completed;
  const totalNotCompleted =
    bookingSummary.procedures.notCompleted +
    bookingSummary.caregiving.notCompleted;
  const totalEarned =
    bookingSummary.procedures.totalEarned +
    bookingSummary.caregiving.totalEarned;
  const totalRequests = totalAccepted + totalRejected;
  const acceptanceRate = ((totalAccepted / totalRequests) * 100).toFixed(1);
  const completionRate = ((totalCompleted / totalAccepted) * 100).toFixed(1);

  const formatCurrency = (value: any) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    return `₦${(value / 1000).toFixed(0)}K`;
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
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Performance Overview
              </h1>
              <p className="text-gray-600">
                Track your bookings, completions, and earnings
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

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <StatCard
            title="Total Requests"
            value={totalRequests}
            subtitle={`${acceptanceRate}% acceptance rate`}
            icon={Activity}
            color="bg-blue-500"
          />
          <StatCard
            title="Accepted"
            value={totalAccepted}
            subtitle="Total accepted bookings"
            icon={CheckCircle}
            color="bg-green-500"
            trend="up"
            trendValue="+15%"
          />
          <StatCard
            title="Rejected"
            value={totalRejected}
            subtitle="Declined requests"
            icon={XCircle}
            color="bg-red-500"
          />
          <StatCard
            title="Completed"
            value={totalCompleted}
            subtitle={`${completionRate}% completion rate`}
            icon={Award}
            color="bg-purple-500"
            trend="up"
            trendValue="+10%"
          />
          <StatCard
            title="Total Earned"
            value={formatCurrency(totalEarned)}
            subtitle={`${formatCurrency(totalEarned / 12)}/month avg`}
            icon={DollarSign}
            color="bg-amber-500"
            trend="up"
            trendValue="+18%"
          />
        </div>

        {/* Service Type Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Procedures Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Syringe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Procedures
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-700 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookingSummary.procedures.accepted}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-700 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookingSummary.procedures.rejected}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-1">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookingSummary.procedures.completed}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-700 mb-1">Not Completed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookingSummary.procedures.notCompleted}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Earned:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(bookingSummary.procedures.totalEarned)}
                </span>
              </div>
            </div>
          </div>

          {/* Caregiving Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Caregiving
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-700 mb-1">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookingSummary.caregiving.accepted}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-700 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookingSummary.caregiving.rejected}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-1">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookingSummary.caregiving.completed}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-yellow-700 mb-1">Not Completed</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookingSummary.caregiving.notCompleted}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Earned:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(bookingSummary.caregiving.totalEarned)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Earnings
              </h2>
              <p className="text-sm text-gray-600">
                Your earnings across all services
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}K`}
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
                    "",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="procedures"
                  fill="#10b981"
                  name="Procedures"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="caregiving"
                  fill="#8b5cf6"
                  name="Caregiving"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Service Completion
              </h2>
              <p className="text-sm text-gray-600">
                Distribution of booking outcomes
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent !== undefined
                      ? `${name} ${(percent * 100).toFixed(0)}%`
                      : name
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {completionStatusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value} bookings
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Acceptance Rate Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Acceptance Rate Trend
              </h2>
              <p className="text-sm text-gray-600">
                Monthly acceptance rate percentage
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={acceptanceRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [`${value}%`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="procedures"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="Procedures"
                />
                <Line
                  type="monotone"
                  dataKey="caregiving"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  name="Caregiving"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Bookings Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Booking Activity
              </h2>
              <p className="text-sm text-gray-600">
                Accepted vs rejected bookings
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBookingsData}>
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
                  dataKey="proceduresAccepted"
                  fill="#10b981"
                  name="Procedures (Accepted)"
                  radius={[4, 4, 0, 0]}
                  stackId="procedures"
                />
                <Bar
                  dataKey="proceduresRejected"
                  fill="#ef4444"
                  name="Procedures (Rejected)"
                  radius={[4, 4, 0, 0]}
                  stackId="procedures"
                />
                <Bar
                  dataKey="caregivingAccepted"
                  fill="#8b5cf6"
                  name="Caregiving (Accepted)"
                  radius={[4, 4, 0, 0]}
                  stackId="caregiving"
                />
                <Bar
                  dataKey="caregivingRejected"
                  fill="#f59e0b"
                  name="Caregiving (Rejected)"
                  radius={[4, 4, 0, 0]}
                  stackId="caregiving"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Performance Summary
            </h2>
            <p className="text-sm text-gray-600">
              Detailed breakdown of your service performance
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Service Type
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Accepted
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Rejected
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Completed
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Not Completed
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount Earned
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    Procedures
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-green-600 font-medium">
                    {bookingSummary.procedures.accepted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-red-600 font-medium">
                    {bookingSummary.procedures.rejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-blue-600 font-medium">
                    {bookingSummary.procedures.completed}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">
                    {bookingSummary.procedures.notCompleted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 font-semibold">
                    {bookingSummary.procedures.accepted +
                      bookingSummary.procedures.rejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                    ₦{bookingSummary.procedures.totalEarned.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    Caregiving
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-green-600 font-medium">
                    {bookingSummary.caregiving.accepted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-red-600 font-medium">
                    {bookingSummary.caregiving.rejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-blue-600 font-medium">
                    {bookingSummary.caregiving.completed}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">
                    {bookingSummary.caregiving.notCompleted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 font-semibold">
                    {bookingSummary.caregiving.accepted +
                      bookingSummary.caregiving.rejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                    ₦{bookingSummary.caregiving.totalEarned.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                  <td className="py-3 px-4 text-sm text-center text-green-700">
                    {totalAccepted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-red-700">
                    {totalRejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-blue-700">
                    {totalCompleted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-yellow-700">
                    {totalNotCompleted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900">
                    {totalRequests}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    ₦{totalEarned.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-900">
                Acceptance Rate
              </h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-700">
              {acceptanceRate}%
            </p>
            <p className="text-xs text-green-600 mt-1">
              Of all booking requests
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-900">
                Completion Rate
              </h3>
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {completionRate}%
            </p>
            <p className="text-xs text-blue-600 mt-1">Of accepted bookings</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-amber-900">
                Average Monthly Earning
              </h3>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-700">
              {formatCurrency(totalEarned / 12)}
            </p>
            <p className="text-xs text-amber-600 mt-1">Per month this year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseOverviewDashboard;
