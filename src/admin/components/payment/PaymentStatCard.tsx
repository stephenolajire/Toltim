import React from "react";
import { DollarSign, Users, ArrowDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  status?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  change,
  changeType,
  icon,
  status,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="text-gray-400">{icon}</div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900">
          {amount}
        </div>

        {status ? (
          <div className="text-sm text-gray-500">{status}</div>
        ) : (
          <div className={`text-sm font-medium ${getChangeColor()}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentStatsCards: React.FC = () => {
  const stats = [
    {
      title: "Total Funding",
      amount: "₦125,500",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Nurses Commission",
      amount: "₦45,200",
      change: "+8% from last month",
      changeType: "positive" as const,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "To Withdrawal",
      amount: "₦18,800",
      change: "",
      changeType: "neutral" as const,
      icon: <ArrowDown className="h-5 w-5" />,
      status: "Pending withdrawals",
    },
    {
      title: "System Commission",
      amount: "₦8,750",
      change: "+15% from last month",
      changeType: "positive" as const,
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-full mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            amount={stat.amount}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            status={stat.status}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentStatsCards;
