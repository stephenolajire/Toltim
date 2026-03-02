import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  TrendingUp,
  ShoppingBag,
  ArrowDownCircle,
  RefreshCw,
} from "lucide-react";
import api from "../../../constant/api";

interface FinanceStats {
  total_funded: number;
  total_spent_on_bookings: number;
  total_withdrawn: number;
  last_sync: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PaymentStat() {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<FinanceStats>({
      queryKey: ["adminFinanceStats"],
      queryFn: async () => {
        const response = await api.get("/wallet/admin-finance-stats/");
        return response.data;
      },
      refetchInterval: 60000,
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load finance stats</p>
        <button
          onClick={() => refetch()}
          className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Funded",
      value: formatCurrency(data?.total_funded ?? 0),
      icon: TrendingUp,
      borderColor: "border-green-400",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      label: "Total Spent on Bookings",
      value: formatCurrency(data?.total_spent_on_bookings ?? 0),
      icon: ShoppingBag,
      borderColor: "border-blue-400",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      label: "Total Withdrawn",
      value: formatCurrency(data?.total_withdrawn ?? 0),
      icon: ArrowDownCircle,
      borderColor: "border-amber-400",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Finance Overview</h2>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            borderColor,
            iconBg,
            iconColor,
            valueColor,
          }) => (
            <div
              key={label}
              className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${borderColor}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
              </div>
              <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            </div>
          ),
        )}
      </div>

      {data?.last_sync && (
        <p className="text-xs text-gray-400 text-right">
          Last synced: {formatDate(data.last_sync)}
        </p>
      )}
    </div>
  );
}
