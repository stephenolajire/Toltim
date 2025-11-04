import { useState, useMemo } from "react";
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

  const role = localStorage.getItem("userType");

  // Theme configuration based on role
  const themeConfig = useMemo(() => {
    const configs = {
      patient: {
        class: "patient-theme",
        primary: "primary",
        bgGradient: "from-primary-50 via-primary-50/30 to-gray-50",
        iconBg: "bg-primary-100",
        iconColor: "text-primary-600",
        buttonBg: "bg-primary-600 hover:bg-primary-700",
        ringColor: "ring-primary-500",
        focusRing: "focus:ring-primary-500",
        badgeBg: "bg-primary-100 text-primary-800",
      },
      nurse: {
        class: "nurse-theme",
        primary: "green",
        bgGradient: "from-green-50 via-green-50/30 to-gray-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        buttonBg: "bg-green-600 hover:bg-green-700",
        ringColor: "ring-green-500",
        focusRing: "focus:ring-green-500",
        badgeBg: "bg-green-100 text-green-800",
      },
      chw: {
        class: "chw-theme",
        primary: "purple",
        bgGradient: "from-purple-50 via-purple-50/30 to-gray-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        buttonBg: "bg-purple-600 hover:bg-purple-700",
        ringColor: "ring-purple-500",
        focusRing: "focus:ring-purple-500",
        badgeBg: "bg-purple-100 text-purple-800",
      },
      admin: {
        class: "admin-theme",
        primary: "gray",
        bgGradient: "from-gray-50 via-gray-50/30 to-white",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        buttonBg: "bg-gray-600 hover:bg-gray-700",
        ringColor: "ring-gray-500",
        focusRing: "focus:ring-gray-500",
        badgeBg: "bg-gray-100 text-gray-800",
      },
    };
    return configs[role as keyof typeof configs] || configs.patient;
  }, [role]);

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

  const getTransactionCategory = (transaction: any) => {
    try {
      const metadata = JSON.parse(transaction.metadata || "{}");
      return metadata.category || "general";
    } catch {
      return "general";
    }
  };

  const parseMetadata = (metadataString: string) => {
    try {
      return JSON.parse(metadataString || "{}");
    } catch {
      return {};
    }
  };

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

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  const getTransactionIcon = (type: string) => {
    if (type === "credit") {
      return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      caregiver: "bg-blue-100 text-blue-800 border border-blue-200",
      "in-patient": "bg-purple-100 text-purple-800 border border-purple-200",
      procedures: "bg-pink-100 text-pink-800 border border-pink-200",
      funding: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      refund: "bg-teal-100 text-teal-800 border border-teal-200",
      general: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return (
      colors[category] || "bg-gray-100 text-gray-800 border border-gray-200"
    );
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
    <div
      className={`${themeConfig.class} min-h-screen bg-gradient-to-br ${themeConfig.bgGradient} pb-8`}
    >
      {role === "admin" && <WalletBalance />}

      <div className="w-full mx-auto py-8">
        {/* Quick Actions */}
        {role === "patient" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${themeConfig.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
                >
                  <CreditCard className={`w-6 h-6 ${themeConfig.iconColor}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Add Card</h3>
                  <p className="text-xs text-gray-600">Link payment card</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Bank Transfer</h3>
                  <p className="text-xs text-gray-600">Fund via bank</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">USSD</h3>
                  <p className="text-xs text-gray-600">Dial to fund</p>
                </div>
              </div>
            </button>

            <button className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Download className="w-6 h-6 text-amber-600" />
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${themeConfig.focusRing} transition-all`}
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${themeConfig.focusRing} appearance-none bg-white cursor-pointer transition-all`}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${themeConfig.focusRing} appearance-none bg-white cursor-pointer transition-all`}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div
                className={`w-10 h-10 ${themeConfig.iconBg} rounded-lg flex items-center justify-center shadow-sm`}
              >
                <Receipt className={`w-5 h-5 ${themeConfig.iconColor}`} />
              </div>
              Transaction History
            </h2>
            <span className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              Showing {filteredTransactions.length} of {transactions.length}
            </span>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map((transaction: any) => {
              const metadata = parseMetadata(transaction.metadata);
              const category = getTransactionCategory(transaction);

              return (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  {/* Desktop View */}
                  <div className="hidden md:flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          transaction.transaction_type === "credit"
                            ? "bg-emerald-100"
                            : "bg-red-100"
                        }`}
                      >
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {transaction.description}
                          </h3>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                              category
                            )}`}
                          >
                            {category.replace("-", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimestamp(transaction.created_at)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" />
                            {transaction.reference}
                          </span>
                        </div>

                        {metadata && Object.keys(metadata).length > 0 && (
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                            {metadata.doctor && (
                              <span className="flex items-center gap-1">
                                <span>👨‍⚕️</span> {metadata.doctor}
                              </span>
                            )}
                            {metadata.hospital && (
                              <span className="flex items-center gap-1">
                                <span>🏥</span> {metadata.hospital}
                              </span>
                            )}
                            {metadata.source && (
                              <span className="flex items-center gap-1">
                                <span>💳</span> {metadata.source}
                              </span>
                            )}
                            {metadata.booking_id && (
                              <span className="flex items-center gap-1">
                                <span>📋</span> {metadata.booking_id}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p
                        className={`text-xl font-bold mb-2 ${
                          transaction.transaction_type === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                            transaction.transaction_type === "credit"
                              ? "bg-emerald-100"
                              : "bg-red-100"
                          }`}
                        >
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {transaction.description}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {formatTimestamp(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-base font-bold flex-shrink-0 ${
                          transaction.transaction_type === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transaction_type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                          category
                        )}`}
                      >
                        {category.replace("-", " ")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
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
            <div className="text-center py-16">
              <div
                className={`w-20 h-20 ${themeConfig.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <Receipt
                  className={`w-10 h-10 ${themeConfig.iconColor} opacity-50`}
                />
              </div>
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
