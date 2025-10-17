import { useState } from "react";
import {
  Wallet,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,

  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Receipt,
  Smartphone,
  Lock,
  Shield,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  description: string;
  amount: number;
  balance: number;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  reference: string;
  metadata?: {
    doctor?: string;
    hospital?: string;
    appointmentId?: string;
    source?: string;
    destination?: string;
  };
}

interface WalletStats {
  totalBalance: number;
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
}

const WalletComponent = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
//   const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  // Sample wallet data
  const walletBalance = 125750;

  const transactions: Transaction[] = [
    {
      id: "TXN001",
      type: "debit",
      category: "consultation",
      description: "Video Consultation - Dr. Sarah Johnson",
      amount: 15000,
      balance: 125750,
      status: "completed",
      timestamp: "2025-10-16T14:30:00",
      reference: "REF-2025-10-16-001",
      metadata: {
        doctor: "Dr. Sarah Johnson",
        hospital: "UniHealth Medical Center",
        appointmentId: "APT-789456",
      },
    },
    {
      id: "TXN002",
      type: "credit",
      category: "funding",
      description: "Wallet Funding via Bank Transfer",
      amount: 50000,
      balance: 140750,
      status: "completed",
      timestamp: "2025-10-16T10:15:00",
      reference: "REF-2025-10-16-002",
      metadata: {
        source: "GTBank - ****1234",
      },
    },
    {
      id: "TXN003",
      type: "debit",
      category: "medication",
      description: "Prescription Payment - Lisinopril 10mg",
      amount: 8500,
      balance: 90750,
      status: "completed",
      timestamp: "2025-10-15T16:45:00",
      reference: "REF-2025-10-15-003",
      metadata: {
        hospital: "HealthPlus Pharmacy",
      },
    },
    {
      id: "TXN004",
      type: "debit",
      category: "lab-test",
      description: "Lab Test - Complete Blood Count (CBC)",
      amount: 12000,
      balance: 99250,
      status: "completed",
      timestamp: "2025-10-15T11:20:00",
      reference: "REF-2025-10-15-004",
      metadata: {
        hospital: "UniHealth Medical Center",
      },
    },
    {
      id: "TXN005",
      type: "credit",
      category: "refund",
      description: "Appointment Cancellation Refund",
      amount: 15000,
      balance: 111250,
      status: "completed",
      timestamp: "2025-10-14T09:00:00",
      reference: "REF-2025-10-14-005",
      metadata: {
        doctor: "Dr. Michael Chen",
        appointmentId: "APT-654321",
      },
    },
    {
      id: "TXN006",
      type: "debit",
      category: "consultation",
      description: "In-Person Consultation - Dr. James Williams",
      amount: 20000,
      balance: 96250,
      status: "completed",
      timestamp: "2025-10-13T15:30:00",
      reference: "REF-2025-10-13-006",
      metadata: {
        doctor: "Dr. James Williams",
        hospital: "Orthopedic Clinic",
        appointmentId: "APT-147258",
      },
    },
    {
      id: "TXN007",
      type: "credit",
      category: "funding",
      description: "Wallet Funding via Card",
      amount: 100000,
      balance: 116250,
      status: "completed",
      timestamp: "2025-10-13T10:00:00",
      reference: "REF-2025-10-13-007",
      metadata: {
        source: "Visa Card - ****5678",
      },
    },
    {
      id: "TXN008",
      type: "debit",
      category: "imaging",
      description: "X-Ray Scan - Knee (Right)",
      amount: 18000,
      balance: 16250,
      status: "completed",
      timestamp: "2025-10-12T14:15:00",
      reference: "REF-2025-10-12-008",
      metadata: {
        hospital: "Orthopedic Imaging Center",
      },
    },
    {
      id: "TXN009",
      type: "debit",
      category: "consultation",
      description: "Telemedicine Consultation - Dr. Sarah Johnson",
      amount: 12000,
      balance: 34250,
      status: "pending",
      timestamp: "2025-10-17T09:00:00",
      reference: "REF-2025-10-17-009",
      metadata: {
        doctor: "Dr. Sarah Johnson",
        appointmentId: "APT-999888",
      },
    },
    {
      id: "TXN010",
      type: "credit",
      category: "funding",
      description: "Wallet Funding via USSD",
      amount: 30000,
      balance: 46250,
      status: "completed",
      timestamp: "2025-10-11T16:30:00",
      reference: "REF-2025-10-11-010",
      metadata: {
        source: "Access Bank - ****9012",
      },
    },
  ];

  // Calculate stats
  const stats: WalletStats = {
    totalBalance: walletBalance,
    totalInflow: transactions
      .filter((t) => t.type === "credit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    totalOutflow: transactions
      .filter((t) => t.type === "debit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.length,
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesType =
      selectedType === "all" || transaction.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    if (type === "credit") {
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      consultation: "bg-blue-100 text-blue-800",
      medication: "bg-purple-100 text-purple-800",
      "lab-test": "bg-pink-100 text-pink-800",
      imaging: "bg-indigo-100 text-indigo-800",
      funding: "bg-green-100 text-green-800",
      refund: "bg-teal-100 text-teal-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="w-full mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                My Wallet
              </h1>
              <p className="text-green-100">Manage your healthcare payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-8">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-green-100 text-sm mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Available Balance
                </p>
                <div className="flex items-center gap-4">
                  <h2 className="text-5xl font-bold">
                    {showBalance ? formatCurrency(walletBalance) : "₦ •••••••"}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {showBalance ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFundModal(true)}
                  className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Fund Wallet
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-green-100">Total Inflow</p>
                    <p className="text-xl font-bold">
                      {showBalance
                        ? formatCurrency(stats.totalInflow)
                        : "₦ •••••"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-green-100">Total Outflow</p>
                    <p className="text-xl font-bold">
                      {showBalance
                        ? formatCurrency(stats.totalOutflow)
                        : "₦ •••••"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-green-100">Transactions</p>
                    <p className="text-xl font-bold">
                      {stats.transactionCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Add Card</h3>
                <p className="text-xs text-gray-600">Link payment card</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                <p className="text-xs text-gray-600">Fund via bank</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">USSD</h3>
                <p className="text-xs text-gray-600">Dial to fund</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Statement</h3>
                <p className="text-xs text-gray-600">Export history</p>
              </div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="consultation">Consultation</option>
                <option value="medication">Medication</option>
                <option value="lab-test">Lab Test</option>
                <option value="imaging">Imaging</option>
                <option value="funding">Funding</option>
                <option value="refund">Refund</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-green-600" />
            Transaction History
            <span className="ml-auto text-sm font-normal text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </span>
          </h2>

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {getTransactionIcon(
                        transaction.category,
                        // transaction.type
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {transaction.description}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                            transaction.category
                          )}`}
                        >
                          {transaction.category.replace("-", " ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(transaction.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Receipt className="w-3 h-3" />
                          {transaction.reference}
                        </span>
                      </div>

                      {/* Metadata */}
                      {transaction.metadata && (
                        <div className="text-xs text-gray-600">
                          {transaction.metadata.doctor && (
                            <span className="mr-3">
                              👨‍⚕️ {transaction.metadata.doctor}
                            </span>
                          )}
                          {transaction.metadata.hospital && (
                            <span className="mr-3">
                              🏥 {transaction.metadata.hospital}
                            </span>
                          )}
                          {transaction.metadata.source && (
                            <span>💳 {transaction.metadata.source}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount and Status */}
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold mb-2 ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your Wallet is Secure
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                All transactions are encrypted and protected. Your wallet is
                secured with industry-standard security protocols. Always verify
                transaction details before confirming payments.
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security Settings
                </button>
                <button className="px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  Transaction Limits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal (Simple overlay for demo) */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Fund Wallet</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  ₦
                </span>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-700">Quick Amount</p>
              <div className="grid grid-cols-3 gap-3">
                {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFundAmount(amount.toString())}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-sm font-medium"
                  >
                    ₦{(amount / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Continue to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletComponent;
