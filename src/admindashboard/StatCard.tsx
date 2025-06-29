import React from "react";
import Navigation from "./Navigation";
import {
  RefreshCw,
  Percent,
  CreditCard,
  Wallet,
  User,
  Users,
  Activity,
  Eye,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  textColor = "text-white",
}) => {
  return (
    <div
      className={`${bgColor} ${textColor} p-6 rounded-xl shadow-lg relative overflow-hidden `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
          <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
        <div className="ml-4 opacity-80">{icon}</div>
      </div>

      {/* Decorative background pattern */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white opacity-5"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-white opacity-5"></div>
    </div>
  );
};

const DashboardMetrics: React.FC = () => {
  const topMetrics = [
    {
      title: "Total Funding",
      value: "₦4,750,000",
      subtitle: "156 transactions",
      icon: <RefreshCw className="w-6 h-6" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Nurse Commission",
      value: "₦2,137,500",
      subtitle: "89 transactions",
      icon: <Percent className="w-6 h-6" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "System Commission",
      value: "₦1,187,500",
      subtitle: "156 transactions",
      icon: <CreditCard className="w-6 h-6" />,
      bgColor: "bg-purple-500",
    },
    {
      title: "Customer Balance",
      value: "₦1,425,000",
      subtitle: "67 transactions",
      icon: <Wallet className="w-6 h-6" />,
      bgColor: "bg-orange-500",
    },
  ];

  const bottomMetrics = [
    {
      title: "Total Nurses",
      value: "23",
      subtitle: "18 verified • 5 pending",
      icon: <User className="w-6 h-6" />,
      bgColor: "bg-teal-500",
    },
    {
      title: "Total Patients",
      value: "156",
      subtitle: "Active registrations",
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-indigo-500",
    },
    {
      title: "Total Treatments",
      value: "342",
      subtitle: "Completed sessions",
      icon: <Activity className="w-6 h-6" />,
      bgColor: "bg-red-500",
    },
  ];

  return (
    <div className="bg-gray-100 mt-2 md:mt-4 px-2 sm:px-4 md:px-20 lg:px-50">
      <div className=" ">
        {/* Top Row - Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {topMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              bgColor={metric.bgColor}
            />
          ))}
        </div>

        {/* Bottom Row - Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {bottomMetrics.map((metric, index) => (
            <div key={index} className="relative">
              <MetricCard
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                icon={metric.icon}
                bgColor={metric.bgColor}
              />
              {metric.title === "Total Nurses" && (
                <button className="absolute top-4 right-16 text-white text-xs hover:text-gray-200 transition-colors flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View More
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default DashboardMetrics;
