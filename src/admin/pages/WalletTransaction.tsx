import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";

interface Transaction {
  id: string;
  type: "Payment" | "Commission" | "Withdrawal";
  from: string;
  to: string;
  amount: string;
  service: string;
  date: string;
  status: "completed" | "pending";
}

const WalletTransactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");

  const transactionsData: Transaction[] = [
    {
      id: "TX001",
      type: "Payment",
      from: "John Doe",
      to: "Sarah Johnson",
      amount: "₦5,000",
      service: "Nursing Care",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "TX002",
      type: "Commission",
      from: "System",
      to: "Michael Chen",
      amount: "₦1,500",
      service: "Procedure Fee",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "TX003",
      type: "Withdrawal",
      from: "Emily Rodriguez",
      to: "Bank Account",
      amount: "₦8,000",
      service: "Earnings",
      date: "2024-01-14",
      status: "pending",
    },
  ];

  const filteredData = useMemo(() => {
    return transactionsData.filter((transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.service.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || transaction.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleExport = () => {
    // Simple CSV export functionality
    const csvContent = [
      ["ID", "Type", "From", "To", "Amount", "Service", "Date", "Status"],
      ...filteredData.map((transaction) => [
        transaction.id,
        transaction.type,
        transaction.from,
        transaction.to,
        transaction.amount,
        transaction.service,
        transaction.date,
        transaction.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wallet-transactions.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          completed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          pending
        </span>
      );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Payment":
        return "text-blue-600";
      case "Commission":
        return "text-green-600";
      case "Withdrawal":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-full mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Wallet Transactions
        </h1>
        <p className="text-gray-600">
          Track all wallet transactions between patients and nurses
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setFilterStatus(filterStatus === "all" ? "completed" : "all")
            }
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={getTypeColor(transaction.type)}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.from}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.to}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.service}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-green-500 hover:text-green-600 text-sm mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} of {transactionsData.length}{" "}
          transactions
        </div>
      )}
    </div>
  );
};

export default WalletTransactions;
