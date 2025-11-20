import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Calendar,
  // DollarSign,
  Heart,
  Syringe,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";
import { useWorkerStats } from "../../constant/GlobalContext";
import Loading from "../../components/common/Loading";
import Error from "../../components/Error";

const NurseOverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const {data, isLoading, isError} = useWorkerStats('nurse');

  console.log("Worker Stats Data:", data);

   const bookingSummary = {
     procedures: {
       accepted: data?.approved || 0,
       rejected: data?.rejected || 0,
       completed: data?.completed || 0,
       notCompleted: data?.pending || 0,
      //  totalEarned: 0,
     },
     caregiving: {
       accepted: data?.caregiving?.approved || 0,
       rejected: data?.caregiving?.rejected || 0,
       completed: data?.caregiving?.completed || 0,
       notCompleted: data?.caregiving?.pending || 0,
      //  totalEarned: 0, 
     },
   };

  const totalAccepted =
    bookingSummary.procedures.accepted + bookingSummary.caregiving.accepted;
  const totalRejected =
    bookingSummary.procedures.rejected + bookingSummary.caregiving.rejected;
  const totalCompleted =
    bookingSummary.procedures.completed + bookingSummary.caregiving.completed;
  const totalNotCompleted =
    bookingSummary.procedures.notCompleted +
    bookingSummary.caregiving.notCompleted;
  // const totalEarned =
  //   bookingSummary.procedures.totalEarned +
  //   bookingSummary.caregiving.totalEarned;
  const totalRequests = totalAccepted + totalRejected;
  const acceptanceRate = ((totalAccepted / totalRequests) * 100).toFixed(1);
  const completionRate = ((totalCompleted / totalAccepted) * 100).toFixed(1);

  // const formatCurrency = (value: any) => {
  //   if (value >= 1000000) {
  //     return `₦${(value / 1000000).toFixed(1)}M`;
  //   }
  //   return `₦${(value / 1000).toFixed(0)}K`;
  // };

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

  if (isLoading) {
    return <Loading/>
  }

  if (isError) {
    return <Error/>
  }

  console.log(data)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex lg:flex-row flex-col items-center justify-between">
            <div>
              <h1 className="lg:text-3xl text-2xl font-bold text-gray-900 mb-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
          {/* <StatCard
            title="Total Earned"
            value={formatCurrency(totalEarned)}
            subtitle={`${formatCurrency(totalEarned / 12)}/month avg`}
            icon={DollarSign}
            color="bg-amber-500"
            trend="up"
            trendValue="+18%"
          /> */}
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
                {/* <span className="text-sm font-medium text-gray-700">
                  Total Earned:
                </span> */}
                <span className="text-xl font-bold text-gray-900">
                  {/* {formatCurrency(bookingSummary.procedures.totalEarned)} */}
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
                {/* <span className="text-sm font-medium text-gray-700">
                  Total Earned:
                </span> */}
                <span className="text-xl font-bold text-gray-900">
                  {/* {formatCurrency(bookingSummary.caregiving.totalEarned)} */}
                </span>
              </div>
            </div>
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
                    {/* ₦{bookingSummary.caregiving.totalEarned.toLocaleString()} */}
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
                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NurseOverviewDashboard;
