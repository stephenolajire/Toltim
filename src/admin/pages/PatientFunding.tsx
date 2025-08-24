import React, { useState, useMemo } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";


interface FundingRecord {
  id: string;
  patient: string;
  amount: string;
  purpose: string;
  donor: string;
  date: string;
  status: "completed" | "pending";
}

const PatientFunding: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");

  const fundingData: FundingRecord[] = [
    {
      id: "FN001",
      patient: "John Doe",
      amount: "₦25,000",
      purpose: "Surgery Fund",
      donor: "Family",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "FN002",
      patient: "Jane Smith",
      amount: "₦15,000",
      purpose: "Cancer Treatment",
      donor: "Community",
      date: "2024-01-16",
      status: "pending",
    },
    {
      id: "FN003",
      patient: "Mike Johnson",
      amount: "₦30,000",
      purpose: "Emergency Care",
      donor: "NGO",
      date: "2024-01-14",
      status: "completed",
    },
  ];

  const filteredData = useMemo(() => {
    return fundingData.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.donor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || record.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleExport = () => {
    // Simple CSV export functionality
    const csvContent = [
      ["ID", "Patient", "Amount", "Purpose", "Donor", "Date", "Status"],
      ...filteredData.map((record) => [
        record.id,
        record.patient,
        record.amount,
        record.purpose,
        record.donor,
        record.date,
        record.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patient-funding.csv";
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

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="my-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Funding
        </h1>
        <p className="text-gray-600">
          Track all patient funding requests and donations
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search funding..."
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
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
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
              {filteredData.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.patient}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.purpose}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.donor}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
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
            <p className="text-gray-500">No funding records found</p>
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
          Showing {filteredData.length} of {fundingData.length} records
        </div>
      )}
    </div>
  );
};

export default PatientFunding;
