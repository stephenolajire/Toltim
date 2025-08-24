import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Check, X } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  type: string;
  status: "Pending" | "Approved" | "Rejected";
  nurse: string;
  description: string;
  date: string;
  time: string;
  amount: string;
}

const WithdrawalRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Pending" | "Approved" | "Rejected"
  >("all");
  const [requests, setRequests] = useState<WithdrawalRequest[]>([
    {
      id: "WD001",
      type: "Withdrawal Request",
      status: "Pending",
      nurse: "Nurse Sarah Johnson",
      description: "Earnings withdrawal",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      amount: "₦8,000",
    },
    {
      id: "WD002",
      type: "Withdrawal Request",
      status: "Pending",
      nurse: "Nurse Sarah Johnson",
      description: "Earnings withdrawal",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      amount: "₦8,000",
    },
    {
      id: "WD003",
      type: "Withdrawal Request",
      status: "Pending",
      nurse: "Nurse Sarah Johnson",
      description: "Earnings withdrawal",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      amount: "₦8,000",
    },
    {
      id: "WD004",
      type: "Withdrawal Request",
      status: "Pending",
      nurse: "Nurse Sarah Johnson",
      description: "Earnings withdrawal",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      amount: "₦8,000",
    },
    {
      id: "WD005",
      type: "Withdrawal Request",
      status: "Pending",
      nurse: "Nurse Sarah Johnson",
      description: "Earnings withdrawal",
      date: "Jan 15, 2024",
      time: "10:30 AM",
      amount: "₦8,000",
    },
  ]);

  const filteredData = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === "" ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.nurse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || request.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, requests]);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: "Approved" as const }
          : request
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? { ...request, status: "Rejected" as const }
          : request
      )
    );
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Type",
        "Nurse",
        "Description",
        "Date",
        "Time",
        "Amount",
        "Status",
      ],
      ...filteredData.map((request) => [
        request.id,
        request.type,
        request.nurse,
        request.description,
        request.date,
        request.time,
        request.amount,
        request.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "withdrawal-requests.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="my-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Withdrawal Requests
        </h1>
        <p className="text-gray-600">Manage nurse withdrawal requests</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search withdrawals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setFilterStatus(filterStatus === "all" ? "Pending" : "all")
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredData.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {request.id}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {request.type}
                  </span>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-gray-600 mb-1">
                  {request.nurse} - {request.description}
                </p>
                <p className="text-sm text-gray-500">
                  {request.date} • {request.time}
                </p>
              </div>

              {/* Right Content */}
              <div className="flex items-center justify-between lg:justify-end gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {request.amount}
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}

                {request.status === "Approved" && (
                  <div className="text-green-600 text-sm font-medium">
                    Approved
                  </div>
                )}

                {request.status === "Rejected" && (
                  <div className="text-red-600 text-sm font-medium">
                    Rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No withdrawal requests found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-green-500 hover:text-green-600 text-sm"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {filteredData.length > 0 && (
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredData.length} of {requests.length} requests
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests;
