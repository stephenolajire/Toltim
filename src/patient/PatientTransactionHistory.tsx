import { useState } from "react";
import { Search, Calendar, Filter } from "lucide-react";
import HistoryNavigation from "./HistoryNav";
import PatientTransactionHistoryCard from "./PatientTransactionHistoryCard";

// Sample appointment data based on your images
const sampleTransactions = [
  {
    id: 1,
    type: "payment",
    title: "Payment",
    description: "Payment for home visit with Nurse Mary Okafor",
    date: "7/21/2025",
    paymentMethod: "Cash",
    amount: -12000,
    status: "completed",
    reference: null,
  },
  {
    id: 2,
    type: "deposit",
    title: "Deposit",
    description: "Wallet deposit via bank transfer",
    date: "7/17/2025",
    paymentMethod: "Bank Transfer",
    amount: 25000,
    status: "completed",
    reference: "BT-202507101456",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment",
    description: "Payment for appointment with CHW Peter Nwankwo",
    date: "7/20/2025",
    paymentMethod: "Mobile Money",
    amount: -3000,
    status: "failed",
    reference: "PAY-202507210456",
  },
  {
    id: 4,
    type: "deposit",
    title: "Deposit",
    description: "Wallet deposit via mobile money",
    date: "7/19/2025",
    paymentMethod: "Mobile Money",
    amount: 50000,
    status: "completed",
    reference: "MM-202507201234",
  },
  {
    id: 5,
    type: "payment",
    title: "Payment",
    description: "Payment for appointment with Dr. Sarah Johnson",
    date: "7/19/2025",
    paymentMethod: "Mobile Money",
    amount: -8000,
    status: "completed",
    reference: "PAY-202507201235",
  },
];


// PatientAppointmentHistoryCard Component


// PatientTransactionHistory Parent Component
const PatientTransactionHistory = () => {
  const transactions = sampleTransactions;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Transactions");

  const filteredTransactions = sampleTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All Transactions" ||
      (filterStatus === "Payments" && transaction.type === "payment") ||
      (filterStatus === "Deposits" && transaction.type === "deposit") ||
      transaction.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    "All Transactions",
    "Payments",
    "Deposits",
    "Completed",
    "Failed",
    "Pending",
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Transaction History
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white appearance-none cursor-pointer min-w-48"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <HistoryNavigation />
      </div>

      {/* Appointments Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length}{" "}
          transactions
        </p>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <PatientTransactionHistoryCard
              key={transaction.id}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "All Appointments"
                ? "Try adjusting your search or filter criteria"
                : "You haven't scheduled any appointments yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTransactionHistory;
