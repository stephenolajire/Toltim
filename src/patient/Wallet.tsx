import { useState, useMemo } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Receipt,
  User,
  Hospital,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useWalletTransactions } from "../constant/GlobalContext";
import Loading from "../components/common/Loading";
import Error from "../components/Error";
import WalletBalance from "../components/Wallet";

const WalletComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(
    new Set(),
  );

  const { data, isLoading, error } = useWalletTransactions();
  if (data) console.log("Wallet Transactions Data:", data);

  const role = localStorage.getItem("userType");

  const toggleExpansion = (transactionId: string) => {
    setExpandedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

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

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!data) return <Loading />;

  const transactions = data.results;

  const getTransactionCategory = (transaction: any) => {
    try {
      const metadata =
        typeof transaction.metadata === "string"
          ? JSON.parse(transaction.metadata)
          : transaction.metadata || {};
      return metadata.category || "general";
    } catch {
      return "general";
    }
  };

  const parseMetadata = (metadataString: string | object) => {
    try {
      if (typeof metadataString === "object") return metadataString;
      return JSON.parse(metadataString || "{}");
    } catch {
      return {};
    }
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    const category = getTransactionCategory(transaction);

    const matchesSearch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    const matchesType =
      selectedType === "all" || transaction.direction === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(numAmount);
  };

  // ── Credit = green-500, Debit = red ──────────────────────────────────────
  const isCredit = (direction: string) => direction === "credit";

  const getTransactionIcon = (direction: string) => {
    if (isCredit(direction)) {
      return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-500" />;
  };

  const getAmountColor = (direction: string) =>
    isCredit(direction) ? "text-green-500" : "text-red-500";

  const getIconBg = (direction: string) =>
    isCredit(direction) ? "bg-green-100" : "bg-red-100";
  // ─────────────────────────────────────────────────────────────────────────

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      caregiver: "bg-blue-100 text-blue-800 border border-blue-200",
      "in-patient": "bg-purple-100 text-purple-800 border border-purple-200",
      procedures: "bg-pink-100 text-pink-800 border border-pink-200",
      funding: "bg-green-100 text-green-800 border border-green-200",
      refund: "bg-teal-100 text-teal-800 border border-teal-200",
      general: "bg-gray-100 text-gray-800 border border-gray-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
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

      <div className="w-full mx-auto">
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
              const isExpanded = expandedTransactions.has(transaction.id);
              const { direction } = transaction;

              return (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-xl hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  {/* Desktop View */}
                  <div className="hidden md:flex items-start justify-between p-5">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${getIconBg(direction)}`}
                      >
                        {getTransactionIcon(direction)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {transaction.description}
                          </h3>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}
                          >
                            {category.replace("-", " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimestamp(transaction.date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Receipt className="w-3.5 h-3.5" />
                            {transaction.reference}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold mb-2 ${getAmountColor(direction)}`}>
                          {isCredit(direction) ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpansion(transaction.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${getIconBg(direction)}`}
                        >
                          {getTransactionIcon(direction)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {transaction.description}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {formatTimestamp(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`text-base font-bold flex-shrink-0 ${getAmountColor(direction)}`}>
                          {isCredit(direction) ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <button
                          onClick={() => toggleExpansion(transaction.id)}
                          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}
                      >
                        {category.replace("-", " ")}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Expanded Metadata */}
                  {isExpanded && metadata && Object.keys(metadata).length > 0 && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Transaction Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {metadata.booking_id && (
                            <div className="flex items-start gap-2 text-sm">
                              <ClipboardList className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Booking ID:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {metadata.booking_id}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.booking_ref && (
                            <div className="flex items-start gap-2 text-sm">
                              <Receipt className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Booking Ref:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {metadata.booking_ref}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.role && (
                            <div className="flex items-start gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Role:</span>
                                <span className="ml-2 text-gray-900 font-medium capitalize">
                                  {metadata.role}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.service_date && (
                            <div className="flex items-start gap-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Service Date:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {new Date(metadata.service_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.doctor && (
                            <div className="flex items-start gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Doctor:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {metadata.doctor}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.hospital && (
                            <div className="flex items-start gap-2 text-sm">
                              <Hospital className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Hospital:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {metadata.hospital}
                                </span>
                              </div>
                            </div>
                          )}
                          {metadata.source && (
                            <div className="flex items-start gap-2 text-sm">
                              <CreditCard className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-gray-500">Source:</span>
                                <span className="ml-2 text-gray-900 font-medium">
                                  {metadata.source}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                <Receipt className={`w-10 h-10 ${themeConfig.iconColor} opacity-50`} />
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
