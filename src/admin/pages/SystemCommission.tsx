import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";

interface CommissionRecord {
  id: string;
  booking: string;
  amount: string;
  percentage: string;
  date: string;
  status: "collected" | "pending";
}

const SystemCommission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "collected" | "pending"
  >("all");

  const commissionData: CommissionRecord[] = [
    {
      id: "SC001",
      booking: "NP001",
      amount: "₦500",
      percentage: "10%",
      date: "2024-01-15",
      status: "collected",
    },
    {
      id: "SC002",
      booking: "CG001",
      amount: "₦750",
      percentage: "15%",
      date: "2024-01-14",
      status: "collected",
    },
    {
      id: "SC003",
      booking: "BP001",
      amount: "₦600",
      percentage: "12%",
      date: "2024-01-13",
      status: "pending",
    },
  ];

  const filteredData = useMemo(() => {
    return commissionData.filter((commission) => {
      const matchesSearch =
        searchTerm === "" ||
        commission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.booking.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.percentage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || commission.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleExport = () => {
    // Simple CSV export functionality
    const csvContent = [
      ["ID", "Booking", "Amount", "Percentage", "Date", "Status"],
      ...filteredData.map((commission) => [
        commission.id,
        commission.booking,
        commission.amount,
        commission.percentage,
        commission.date,
        commission.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "system-commission.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    if (status === "collected") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
          collected
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

  return (
    <div className="w-full mx-auto py-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          System Commission
        </h1>
        <p className="text-gray-600">
          Track all system commission from bookings
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search commission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setFilterStatus(filterStatus === "all" ? "collected" : "all")
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
                  Booking
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
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
              {filteredData.map((commission) => (
                <tr
                  key={commission.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {commission.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.booking}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {commission.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.percentage}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(commission.status)}
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
            <p className="text-gray-500">No commission records found</p>
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
          Showing {filteredData.length} of {commissionData.length} commission
          records
        </div>
      )}
    </div>
  );
};

export default SystemCommission;
