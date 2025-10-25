import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Heart,
  Building2,
  Syringe,
  TrendingUp,
} from "lucide-react";

const PatientOverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - Replace with actual API data from patient bookings
  const bookingSummary = {
    procedures: {
      accepted: 12,
      rejected: 3,
      pending: 2,
      totalSpent: 450000,
    },
    caregiving: {
      accepted: 8,
      rejected: 1,
      pending: 1,
      totalSpent: 680000,
    },
    inPatient: {
      accepted: 5,
      rejected: 2,
      pending: 0,
      totalSpent: 920000,
    },
  };

  // Monthly spending data
  // const monthlySpendingData = [
  //   { month: "Jan", procedures: 35000, caregiving: 50000, inPatient: 75000 },
  //   { month: "Feb", procedures: 42000, caregiving: 55000, inPatient: 80000 },
  //   { month: "Mar", procedures: 38000, caregiving: 60000, inPatient: 85000 },
  //   { month: "Apr", procedures: 45000, caregiving: 58000, inPatient: 90000 },
  //   { month: "May", procedures: 40000, caregiving: 65000, inPatient: 95000 },
  //   { month: "Jun", procedures: 48000, caregiving: 62000, inPatient: 88000 },
  //   { month: "Jul", procedures: 36000, caregiving: 70000, inPatient: 92000 },
  //   { month: "Aug", procedures: 50000, caregiving: 68000, inPatient: 85000 },
  //   { month: "Sep", procedures: 43000, caregiving: 72000, inPatient: 98000 },
  //   { month: "Oct", procedures: 47000, caregiving: 75000, inPatient: 100000 },
  //   { month: "Nov", periods: 41000, caregiving: 80000, inPatient: 87000 },
  //   { month: "Dec", procedures: 45000, caregiving: 65000, inPatient: 95000 },
  // ];

  // Booking status distribution
  // const bookingStatusData = [
  //   { name: "Accepted", value: 25, color: "#10b981" },
  //   { name: "Rejected", value: 6, color: "#ef4444" },
  //   { name: "Pending", value: 3, color: "#f59e0b" },
  // ];

  // Monthly booking counts
  // const monthlyBookingsData = [
  //   { month: "Jan", procedures: 1, caregiving: 1, inPatient: 0 },
  //   { month: "Feb", procedures: 2, caregiving: 1, inPatient: 1 },
  //   { month: "Mar", procedures: 1, caregiving: 0, inPatient: 1 },
  //   { month: "Apr", procedures: 2, caregiving: 1, inPatient: 0 },
  //   { month: "May", procedures: 1, caregiving: 1, inPatient: 1 },
  //   { month: "Jun", procedures: 2, caregiving: 1, inPatient: 1 },
  //   { month: "Jul", procedures: 0, caregiving: 1, inPatient: 0 },
  //   { month: "Aug", procedures: 1, caregiving: 1, inPatient: 0 },
  //   { month: "Sep", procedures: 1, caregiving: 0, inPatient: 1 },
  //   { month: "Oct", procedures: 1, caregiving: 1, inPatient: 0 },
  //   { month: "Nov", procedures: 0, caregiving: 0, inPatient: 0 },
  //   { month: "Dec", procedures: 0, caregiving: 0, inPatient: 0 },
  // ];

  // Calculate totals
  const totalAccepted =
    bookingSummary.procedures.accepted +
    bookingSummary.caregiving.accepted +
    bookingSummary.inPatient.accepted;
  const totalRejected =
    bookingSummary.procedures.rejected +
    bookingSummary.caregiving.rejected +
    bookingSummary.inPatient.rejected;
  const totalPending =
    bookingSummary.procedures.pending +
    bookingSummary.caregiving.pending +
    bookingSummary.inPatient.pending;
  const totalBookings = totalAccepted + totalRejected + totalPending;
  const totalSpent =
    bookingSummary.procedures.totalSpent +
    bookingSummary.caregiving.totalSpent +
    bookingSummary.inPatient.totalSpent;
  const acceptanceRate = (
    (totalAccepted / (totalAccepted + totalRejected)) *
    100
  ).toFixed(1);

  const formatCurrency = (value:any) => {
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
                My Overview
              </h1>
              <p className="text-gray-600">
                Track your healthcare bookings and spending
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            subtitle={`${acceptanceRate}% acceptance rate`}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Accepted Bookings"
            value={totalAccepted}
            subtitle="Completed & Active"
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatCard
            title="Rejected Bookings"
            value={totalRejected}
            subtitle="Unsuccessful requests"
            icon={XCircle}
            color="bg-red-500"
          />
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle={`${formatCurrency(totalSpent / 12)}/month avg`}
            icon={DollarSign}
            color="bg-purple-500"
            trend="up"
            trendValue="+12%"
          />
        </div>

        {/* Service Type Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accepted:</span>
                <span className="text-lg font-bold text-green-600">
                  {bookingSummary.procedures.accepted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected:</span>
                <span className="text-lg font-bold text-red-600">
                  {bookingSummary.procedures.rejected}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {bookingSummary.procedures.pending}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Total Spent:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(bookingSummary.procedures.totalSpent)}
                  </span>
                </div>
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
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accepted:</span>
                <span className="text-lg font-bold text-green-600">
                  {bookingSummary.caregiving.accepted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected:</span>
                <span className="text-lg font-bold text-red-600">
                  {bookingSummary.caregiving.rejected}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {bookingSummary.caregiving.pending}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Total Spent:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(bookingSummary.caregiving.totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* In-Patient Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                In-Patient
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accepted:</span>
                <span className="text-lg font-bold text-green-600">
                  {bookingSummary.inPatient.accepted}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected:</span>
                <span className="text-lg font-bold text-red-600">
                  {bookingSummary.inPatient.rejected}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="text-lg font-bold text-yellow-600">
                  {bookingSummary.inPatient.pending}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Total Spent:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(bookingSummary.inPatient.totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Spending
              </h2>
              <p className="text-sm text-gray-600">
                Your spending across all services
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpendingData}>
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
                <Bar
                  dataKey="inPatient"
                  fill="#3b82f6"
                  name="In-Patient"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking Status
              </h2>
              <p className="text-sm text-gray-600">
                Distribution of your bookings
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
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
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {bookingStatusData.map((item, index) => (
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
        </div> */}

        {/* Monthly Bookings Trend */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Activity
            </h2>
            <p className="text-sm text-gray-600">
              Number of bookings per month by service type
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyBookingsData}>
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
              <Line
                type="monotone"
                dataKey="inPatient"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                name="In-Patient"
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}

        {/* Summary Table */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Summary Statistics
            </h2>
            <p className="text-sm text-gray-600">
              Detailed breakdown of your bookings
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
                    Pending
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount Spent
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
                  <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">
                    {bookingSummary.procedures.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 font-semibold">
                    {bookingSummary.procedures.accepted +
                      bookingSummary.procedures.rejected +
                      bookingSummary.procedures.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                    ₦{bookingSummary.procedures.totalSpent.toLocaleString()}
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
                  <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">
                    {bookingSummary.caregiving.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 font-semibold">
                    {bookingSummary.caregiving.accepted +
                      bookingSummary.caregiving.rejected +
                      bookingSummary.caregiving.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                    ₦{bookingSummary.caregiving.totalSpent.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    In-Patient
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-green-600 font-medium">
                    {bookingSummary.inPatient.accepted}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-red-600 font-medium">
                    {bookingSummary.inPatient.rejected}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-yellow-600 font-medium">
                    {bookingSummary.inPatient.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900 font-semibold">
                    {bookingSummary.inPatient.accepted +
                      bookingSummary.inPatient.rejected +
                      bookingSummary.inPatient.pending}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">
                    ₦{bookingSummary.inPatient.totalSpent.toLocaleString()}
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
                  <td className="py-3 px-4 text-sm text-center text-yellow-700">
                    {totalPending}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-900">
                    {totalBookings}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900">
                    ₦{totalSpent.toLocaleString()}
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

export default PatientOverviewDashboard;
