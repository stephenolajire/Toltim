import { useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  Building2,
  Receipt,
  Smartphone,
} from "lucide-react";
import { useWalletTransactions } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import Error from "../components/Error";
import WalletBalance from "../components/Wallet";

const WalletComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data, isLoading, error } = useWalletTransactions();
  
  const role =  localStorage.getItem("userType")

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!data) {
    return <Loading />;
  }

  const transactions = data.results;

  // Parse metadata and extract category
  const getTransactionCategory = (transaction: any) => {
    try {
      const metadata = JSON.parse(transaction.metadata || "{}");
      return metadata.category || "general";
    } catch {
      return "general";
    }
  };

  // Parse metadata for additional info
  const parseMetadata = (metadataString: string) => {
    try {
      return JSON.parse(metadataString || "{}");
    } catch {
      return {};
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction: any) => {
    const category = getTransactionCategory(transaction);

    const matchesSearch =
      searchQuery === "" ||
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    const matchesType =
      selectedType === "all" || transaction.transaction_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Helper functions
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  const getTransactionIcon = (type: string) => {
    if (type === "credit") {
      return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      caregiver: "bg-blue-100 text-blue-800",
      "in-patient": "bg-purple-100 text-purple-800",
      procedures: "bg-pink-100 text-pink-800",
      funding: "bg-green-100 text-green-800",
      refund: "bg-teal-100 text-teal-800",
      general: "bg-gray-100 text-gray-800",
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
      {role == 'admin' && (
        <WalletBalance/>
      )}
      <div className="w-full mx-auto px-6 py-8">
        {/* Quick Actions */}
        {role == "patient" && (
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
        )}

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
                <option value="caregiver">Caregiver</option>
                <option value="in-patient">In Patient</option>
                <option value="procedures">Procedures</option>
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
            {filteredTransactions.map((transaction: any) => {
              const metadata = parseMetadata(transaction.metadata);
              const category = getTransactionCategory(transaction);

              return (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Desktop View */}
                  <div className="hidden md:flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          transaction.transaction_type === "credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {transaction.description}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                              category
                            )}`}
                          >
                            {category.replace("-", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(transaction.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            {transaction.reference}
                          </span>
                        </div>

                        {metadata && Object.keys(metadata).length > 0 && (
                          <div className="text-xs text-gray-600">
                            {metadata.doctor && (
                              <span className="mr-3">👨‍⚕️ {metadata.doctor}</span>
                            )}
                            {metadata.hospital && (
                              <span className="mr-3">
                                🏥 {metadata.hospital}
                              </span>
                            )}
                            {metadata.source && (
                              <span>💳 {metadata.source}</span>
                            )}
                            {metadata.booking_id && (
                              <span className="mr-3">
                                📋 {metadata.booking_id}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xl font-bold mb-2 ${
                          transaction.transaction_type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.transaction_type === "credit"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {transaction.description}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {formatTimestamp(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-base font-bold ${
                          transaction.transaction_type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(
                          category
                        )}`}
                      >
                        {category.replace("-", " ")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    </div>

                    {metadata && Object.keys(metadata).length > 0 && (
                      <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                        {metadata.doctor && <span>👨‍⚕️ {metadata.doctor}</span>}
                        {metadata.hospital && (
                          <span>🏥 {metadata.hospital}</span>
                        )}
                        {metadata.source && <span>💳 {metadata.source}</span>}
                        {metadata.booking_id && (
                          <span>📋 {metadata.booking_id}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
      </div>
    </div>
  );
};

export default WalletComponent;
