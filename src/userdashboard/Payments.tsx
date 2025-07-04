import React, { useState } from "react";
import { Download, Filter, Calendar, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  title: string;
  date: string;
  transactionId: string;
  paymentMethod: string;
  provider: string;
  amount: number;
  status: "completed" | "pending";
  type: "service" | "topup";
}

const PaymentHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  const transactions: Transaction[] = [
    // Service Payments (3 items)
    {
      id: "1",
      title: "Wound Care Session - Sarah Okafor",
      date: "2024-06-25",
      transactionId: "TXN-001",
      paymentMethod: "Via Wallet",
      provider: "Nurse: Sarah Okafor",
      amount: -8000,
      status: "completed",
      type: "service",
    },
    {
      id: "2",
      title: "Complete Blood Count Test",
      date: "2024-06-23",
      transactionId: "TXN-003",
      paymentMethod: "Via Card",
      provider: "Lab: MedLab Diagnostics",
      amount: -12000,
      status: "completed",
      type: "service",
    },
    {
      id: "3",
      title: "Vital Signs Monitoring",
      date: "2024-06-20",
      transactionId: "TXN-005",
      paymentMethod: "Via Wallet",
      provider: "Nurse: Mary Adebayo",
      amount: -5000,
      status: "completed",
      type: "service",
    },

    // Wallet Funding (3 items)
    {
      id: "4",
      title: "Wallet Top-up via Bank Transfer",
      date: "2024-06-24",
      transactionId: "TXN-002",
      paymentMethod: "Via Bank Transfer",
      provider: "Ref: REF-BT-12345",
      amount: 50000,
      status: "completed",
      type: "topup",
    },
    {
      id: "5",
      title: "Wallet Top-up via Card",
      date: "2024-06-18",
      transactionId: "TXN-006",
      paymentMethod: "Via Card",
      provider: "Ref: REF-CD-67890",
      amount: 25000,
      status: "completed",
      type: "topup",
    },
    {
      id: "6",
      title: "Wallet Top-up via Mobile Transfer",
      date: "2024-06-10",
      transactionId: "TXN-008",
      paymentMethod: "Via Mobile Money",
      provider: "Ref: REF-MM-98765",
      amount: 15000,
      status: "completed",
      type: "topup",
    },

    // Pending Payments (3 items)
    {
      id: "7",
      title: "Post-Surgical Care - 3 Sessions",
      date: "2024-06-22",
      transactionId: "TXN-004",
      paymentMethod: "Via Wallet",
      provider: "Nurse: Grace Eme",
      amount: -45000,
      status: "pending",
      type: "service",
    },
    {
      id: "8",
      title: "Antenatal Check-up Session",
      date: "2024-06-15",
      transactionId: "TXN-007",
      paymentMethod: "Via Wallet",
      provider: "Nurse: Sarah Okafor",
      amount: -10000,
      status: "pending",
      type: "service",
    },
    {
      id: "9",
      title: "Physiotherapy Session - 2 Sessions",
      date: "2024-06-12",
      transactionId: "TXN-009",
      paymentMethod: "Via Card",
      provider: "Therapist: Dr. John Emeka",
      amount: -22000,
      status: "pending",
      type: "service",
    },
  ];

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    const sign = amount >= 0 ? "+" : "";
    return `${sign}₦${absAmount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case "service":
        return transactions.filter((t) => t.type === "service");
      case "wallet":
        return transactions.filter((t) => t.type === "topup");
      case "pending":
        return transactions.filter((t) => t.status === "pending");
      default:
        return transactions;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment History
          </h2>
          <p className="text-gray-600">
            Track your healthcare spending and wallet activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-600">
                Wallet Balance
              </h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              ₦45,000
            </p>
            <Link to='/dashboard/funding'>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md font-medium hover:bg-green-600 transition-colors text-sm sm:text-base">
                Fund Wallet
              </button>
            </Link>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <span className="text-blue-500 text-lg mr-2">₦</span>
              <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-500">
              ₦156,000
            </p>
            <p className="text-sm text-gray-500 mt-1">
              All-time healthcare spending
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <span className="text-orange-500 text-lg mr-2">⏳</span>
              <h3 className="text-sm font-medium text-gray-600">
                Pending Payments
              </h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-500">
              ₦22,000
            </p>
            <p className="text-sm text-gray-500 mt-1">Ongoing treatments</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction History
              </h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 overflow-x-auto mb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Transactions
              </button>
              <button
                onClick={() => setActiveTab("service")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === "service"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Service Payments
              </button>
              <button
                onClick={() => setActiveTab("wallet")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === "wallet"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Wallet Funding
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === "pending"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Pending
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {getFilteredTransactions().map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            transaction.status === "completed"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 break-words">
                            {transaction.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 break-words">
                            {transaction.provider}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p
                          className={`text-lg font-semibold ${
                            transaction.amount >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatAmount(transaction.amount)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Completed"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-gray-500 ml-5">
                      <span>📅 {formatDate(transaction.date)}</span>
                      <span>ID: {transaction.transactionId}</span>
                      <span>{transaction.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          transaction.status === "completed"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 truncate">
                          {transaction.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span>📅 {formatDate(transaction.date)}</span>
                          <span>ID: {transaction.transactionId}</span>
                          <span>{transaction.paymentMethod}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {transaction.provider}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.amount >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatAmount(transaction.amount)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600 transition-colors">
              <Wallet className="w-5 h-5" />
              Fund Wallet
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-md font-medium border hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5" />
              Download Statement
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-md font-medium border hover:bg-gray-50 transition-colors sm:col-span-2 lg:col-span-1">
              <Calendar className="w-5 h-5" />
              Payment Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
