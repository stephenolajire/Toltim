import { Download, Loader2 } from "lucide-react";
import React from "react";
import StatCard from "./StatCard";
import VerificationNavigation from "./VerificationNav";
import { Outlet } from "react-router-dom";
import { useNurseVerificationStat } from "../../../constant/GlobalContext";

const AdminVerificationLayout: React.FC = () => {
  const { data: statData, isLoading } = useNurseVerificationStat();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <div className="text-lg text-gray-600">Loading nurses data...</div>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: "Pending Verifications",
      value: statData.pending,
      change: "",
      changeType: "increase" as const,
      icon: "pending" as const,
      iconColor: "text-orange-500",
    },
    {
      title: "Total Verified",
      value: statData.approved,
      change: "",
      changeType: "increase" as const,
      icon: "verified" as const,
      iconColor: "text-green-500",
    },
    {
      title: "Total Rejected",
      value: statData.rejected,
      change: "",
      changeType: "decrease" as const,
      icon: "rejected" as const,
      iconColor: "text-red-500",
    },
    {
      title: "Total Verification",
      value: statData.total,
      change: "",
      changeType: "increase" as const,
      icon: "rate" as const,
      iconColor: "text-blue-500",
    },
  ];
  return (
    <div>
      <div className="flex flex-col md:flex-row md:space-y-0 items-center justify-between w-full mb-5 md:mb-0">
        <div className="py-5">
          <h1 className="font-bold text-black md:text-4xl text-3xl capitalize">
            Verifications Management
          </h1>
          <p className="text-gray-500 mt-1">
            Review and verify healthcare professionals and community health
            workers
          </p>
        </div>
        <div className="px-4">
          <button className=" px-4 py-2 w-full border border-gray-200 text-black/70 flex space-x-3 rounded-lg items-center justify-center transition-colors">
            <span>
              <Download size={18} />
            </span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="py-5">
        <VerificationNavigation />
      </div>

      <div className="pb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminVerificationLayout;
