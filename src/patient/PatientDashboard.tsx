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
  TrendingDown,
} from "lucide-react";
import { useFinancialSummary, usePatientStats } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import Error from "../components/Error";

const PatientOverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, isError } = usePatientStats();
  const {data:summary, isLoading:loading, isError:error} = useFinancialSummary()

  // Transform API data to match component structure
  const bookingSummary = data
    ? {
        procedures: {
          accepted: data.procedures.approved + data.procedures.completed,
          rejected: data.procedures.rejected,
          pending: data.procedures.pending,
          totalSpent: 0, // Add this field to your API if available
        },
        caregiving: {
          accepted: data.caregiving.approved + data.caregiving.completed,
          rejected: data.caregiving.rejected,
          pending: data.caregiving.pending,
          totalSpent: 0, // Add this field to your API if available
        },
        inPatient: {
          accepted: data.in_patient.approved + data.in_patient.completed,
          rejected: data.in_patient.rejected,
          pending: data.in_patient.pending,
          totalSpent: 0, // Add this field to your API if available
        },
      }
    : {
        procedures: { accepted: 0, rejected: 0, pending: 0, totalSpent: 0 },
        caregiving: { accepted: 0, rejected: 0, pending: 0, totalSpent: 0 },
        inPatient: { accepted: 0, rejected: 0, pending: 0, totalSpent: 0 },
      };

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
  const totalBookings = data?.overall_total || 0;
  // const totalSpent =
  //   bookingSummary.procedures.totalSpent +
  //   bookingSummary.caregiving.totalSpent +
  //   bookingSummary.inPatient.totalSpent;
  const acceptanceRate = (
    (totalAccepted / (totalAccepted + totalRejected)) *
    100
  ).toFixed(1);

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
    colorClass: string;
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    colorClass,
  }) => (
    <div className="patient-theme bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-sm`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              trend === "up"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-700 ring-1 ring-red-200"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );

  interface ServiceCardProps {
    title: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    accepted: number;
    rejected: number;
    pending: number;
    totalSpent: number;
  }

  const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    icon: Icon,
    iconColor,
    iconBg,
    accepted,
    rejected,
    pending,
    // totalSpent,
  }) => (
    <div className="patient-theme bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-3.5">
        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <span className="text-sm font-medium text-gray-700">Accepted</span>
          <span className="text-lg font-bold text-emerald-600">{accepted}</span>
        </div>

        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-50/50 border border-red-100">
          <span className="text-sm font-medium text-gray-700">Rejected</span>
          <span className="text-lg font-bold text-red-600">{rejected}</span>
        </div>

        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-amber-50/50 border border-amber-100">
          <span className="text-sm font-medium text-gray-700">Pending</span>
          <span className="text-lg font-bold text-amber-600">{pending}</span>
        </div>

        {/* <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">
              Total Spent
            </span>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(totalSpent)}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );

  if (isLoading || loading) {
    return <Loading />;
  }

  if (isError || error) {
    return <Error />;
  }

  // console.log("patient stat:", data);
  console.log(summary)

  return (
    <div className="patient-theme min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Overview
              </h1>
              <p className="text-gray-600 font-medium">
                Track your healthcare bookings and spending
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <Calendar className="w-5 h-5 text-primary-600" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-2 py-1 text-sm font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            subtitle={`${acceptanceRate}% acceptance rate`}
            icon={Users}
            colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Accepted Bookings"
            value={totalAccepted}
            subtitle="Completed & Active"
            icon={CheckCircle}
            colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="Rejected Bookings"
            value={totalRejected}
            subtitle="Unsuccessful requests"
            icon={XCircle}
            colorClass="bg-gradient-to-br from-red-500 to-red-600"
          />
          <StatCard
            title="Pending Requests"
            value={totalPending}
            subtitle="Unapproved requests"
            icon={DollarSign}
            colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Service Type Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="Procedures"
            icon={Syringe}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
            accepted={bookingSummary.procedures.accepted}
            rejected={bookingSummary.procedures.rejected}
            pending={bookingSummary.procedures.pending}
            totalSpent={bookingSummary.procedures.totalSpent}
          />

          <ServiceCard
            title="Caregiving"
            icon={Heart}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
            accepted={bookingSummary.caregiving.accepted}
            rejected={bookingSummary.caregiving.rejected}
            pending={bookingSummary.caregiving.pending}
            totalSpent={bookingSummary.caregiving.totalSpent}
          />

          <ServiceCard
            title="In-Patient"
            icon={Building2}
            iconColor="text-primary-600"
            iconBg="bg-primary-100"
            accepted={bookingSummary.inPatient.accepted}
            rejected={bookingSummary.inPatient.rejected}
            pending={bookingSummary.inPatient.pending}
            totalSpent={bookingSummary.inPatient.totalSpent}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientOverviewDashboard;
